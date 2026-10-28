import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { COUNTRIES } from '@entities/country/model/country.data'
import { SETTINGS_STORAGE_KEY, settingsService } from '@entities/settings'

import { SettingsPage } from './SettingsPage'

import * as settingsStyles from './SettingsPage.css'

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }))

vi.mock('react-hot-toast', () => {
  const success = vi.fn()
  const toastFn = vi.fn()
  return {
    __esModule: true,
    default: Object.assign(toastFn, { success, error: vi.fn() }),
  }
})

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: (props: { to: string; children: ReactNode; className?: string }) => (
      <a href={props.to} className={props.className}>
        {props.children}
      </a>
    ),
    useNavigate: () => navigate,
  }
})

const catalogSize = COUNTRIES.length

function renderSettingsPage() {
  render(<SettingsPage />)
}

describe('SettingsPage', () => {
  let writeSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    writeSpy = vi.spyOn(settingsService, 'write')
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('starts a round without writing when Save and play is unchanged', () => {
    renderSettingsPage()

    const ten = screen.getByRole('radio', { name: /Quick play/ })
    expect(ten).toBeChecked()
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    expect(customInput).not.toBeDisabled()
    expect(customInput).toHaveValue(null)
    expect(customInput.className).toContain(settingsStyles.numberInputInactive)

    fireEvent.click(screen.getByRole('button', { name: 'Save and play' }))

    expect(writeSpy).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith({ to: '/game' })
    expect(toast).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('selects Custom when the custom round size input is focused', () => {
    renderSettingsPage()

    expect(screen.getByRole('radio', { name: /Quick play/ })).toBeChecked()
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.focus(customInput)
    expect(screen.getByRole('radio', { name: /Custom/ })).toBeChecked()
    expect(customInput.className).not.toContain(
      settingsStyles.numberInputInactive,
    )
  })

  it('persists 25 when that preset is saved', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Classic/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Save and play' }))

    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(writeSpy).toHaveBeenCalledWith({
      round: { kind: 'fixed', value: 25 },
      sfxEnabled: false,
    })
    expect(settingsService.read()).toEqual({
      round: { kind: 'fixed', value: 25 },
      sfxEnabled: false,
    })
    expect(navigate).toHaveBeenCalledWith({ to: '/game' })
    expect(writeSpy.mock.invocationCallOrder[0]).toBeLessThan(
      navigate.mock.invocationCallOrder[0],
    )
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('preserves sfxEnabled when the round preset is saved', () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        round: { kind: 'fixed', value: 10 },
        sfxEnabled: true,
      }),
    )

    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Classic/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Save and play' }))

    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(settingsService.read()).toEqual({
      round: { kind: 'fixed', value: 25 },
      sfxEnabled: true,
    })
  })

  it('persists all-countries when the All preset is saved', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Every country/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Save and play' }))

    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(writeSpy).toHaveBeenCalledWith({
      round: { kind: 'all-countries' },
      sfxEnabled: false,
    })
    expect(settingsService.read()).toEqual({
      round: { kind: 'all-countries' },
      sfxEnabled: false,
    })
    expect(navigate).toHaveBeenCalledWith({ to: '/game' })
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('persists a custom fixed value when Custom is valid', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Custom/ }))
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.change(customInput, { target: { value: '17' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save and play' }))

    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(writeSpy).toHaveBeenCalledWith({
      round: { kind: 'fixed', value: 17 },
      sfxEnabled: false,
    })
    expect(settingsService.read()).toEqual({
      round: { kind: 'fixed', value: 17 },
      sfxEnabled: false,
    })
    expect(navigate).toHaveBeenCalledWith({ to: '/game' })
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('disables Save and play and marks an empty Custom value invalid', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Custom/ }))
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.change(customInput, { target: { value: '' } })

    const submit = screen.getByRole('button', { name: 'Save and play' })
    expect(submit).toBeDisabled()
    expect(customInput).toHaveAttribute('aria-invalid', 'true')

    fireEvent.submit(submit.closest('form')!)

    expect(writeSpy).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('disables Save and play when Custom is not a positive integer string', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Custom/ }))
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.change(customInput, { target: { value: '12a' } })

    expect(screen.getByRole('button', { name: 'Save and play' })).toBeDisabled()
    expect(customInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('clamps 0 to 1 on blur when Custom is selected', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Custom/ }))
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.change(customInput, { target: { value: '0' } })
    fireEvent.blur(customInput)

    expect(customInput).toHaveValue(1)
  })

  it('clamps values above the catalog size down to the catalog size on blur', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Custom/ }))
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.change(customInput, {
      target: { value: String(catalogSize + 1) },
    })
    fireEvent.blur(customInput)

    expect(customInput).toHaveValue(catalogSize)
  })

  it('rehydrates Custom with the saved value after reopening the page', () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        round: { kind: 'fixed', value: 17 },
        sfxEnabled: false,
      }),
    )

    renderSettingsPage()

    expect(screen.getByRole('radio', { name: /Custom/ })).toBeChecked()
    expect(
      screen.getByRole('spinbutton', { name: 'Custom round size' }),
    ).toHaveValue(17)
  })

  it('retains the selection after a failed save and starts the round on retry', () => {
    writeSpy.mockReturnValueOnce(false)
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Classic/ }))
    const submit = screen.getByRole('button', { name: 'Save and play' })
    fireEvent.click(submit)

    expect(navigate).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith(
      'Could not save settings. Please try again.',
    )
    expect(screen.getByRole('radio', { name: /Classic/ })).toBeChecked()

    fireEvent.click(submit)

    expect(settingsService.read().round).toEqual({ kind: 'fixed', value: 25 })
    expect(navigate).toHaveBeenCalledWith({ to: '/game' })
    expect(toast.success).not.toHaveBeenCalled()
    expect(toast).not.toHaveBeenCalled()
  })

  it('Back to Start does not write an unsaved selection', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Classic/ }))
    fireEvent.click(screen.getByRole('link', { name: 'Back to Start' }))

    expect(writeSpy).not.toHaveBeenCalled()
  })
})
