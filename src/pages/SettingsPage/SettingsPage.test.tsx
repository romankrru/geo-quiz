import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { COUNTRIES } from '@entities/country/model/country.data'
import {
  PREFERENCES_STORAGE_KEY,
  preferencesService,
} from '@entities/preferences'

import { SettingsPage } from './SettingsPage'

import * as settingsStyles from './SettingsPage.css'

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
  }
})

const catalogSize = COUNTRIES.length

function renderSettingsPage() {
  render(<SettingsPage />)
}

describe('SettingsPage', () => {
  let writeSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    localStorage.clear()
    writeSpy = vi.spyOn(preferencesService, 'write')
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows 10 preset on first load and does not write on Save without edits', () => {
    renderSettingsPage()

    const ten = screen.getByRole('radio', { name: /Quick play/ })
    expect(ten).toBeChecked()
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    expect(customInput).not.toBeDisabled()
    expect(customInput).toHaveValue(null)
    expect(customInput.className).toContain(settingsStyles.numberInputInactive)

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(writeSpy).not.toHaveBeenCalled()
    expect(toast).toHaveBeenCalledWith('Already up to date')
    expect(toast.success).not.toHaveBeenCalled()
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
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(writeSpy).toHaveBeenCalledWith({
      round: { kind: 'fixed', value: 25 },
      sfxEnabled: false,
    })
    expect(preferencesService.read()).toEqual({
      round: { kind: 'fixed', value: 25 },
      sfxEnabled: false,
    })
    expect(toast.success).toHaveBeenCalledWith('Settings saved')
  })

  it('preserves sfxEnabled when the round preset is saved', () => {
    localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        round: { kind: 'fixed', value: 10 },
        sfxEnabled: true,
      }),
    )

    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Classic/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(preferencesService.read()).toEqual({
      round: { kind: 'fixed', value: 25 },
      sfxEnabled: true,
    })
  })

  it('persists all-countries when the All preset is saved', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Every country/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(writeSpy).toHaveBeenCalledWith({
      round: { kind: 'all-countries' },
      sfxEnabled: false,
    })
    expect(preferencesService.read()).toEqual({
      round: { kind: 'all-countries' },
      sfxEnabled: false,
    })
    expect(toast.success).toHaveBeenCalledWith('Settings saved')
  })

  it('persists a custom fixed value when Custom is valid and Save is pressed', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Custom/ }))
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.change(customInput, { target: { value: '17' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(writeSpy).toHaveBeenCalledWith({
      round: { kind: 'fixed', value: 17 },
      sfxEnabled: false,
    })
    expect(preferencesService.read()).toEqual({
      round: { kind: 'fixed', value: 17 },
      sfxEnabled: false,
    })
    expect(toast.success).toHaveBeenCalledWith('Settings saved')
  })

  it('disables Save and marks the custom input invalid when Custom is active but the value is empty', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Custom/ }))
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.change(customInput, { target: { value: '' } })

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(customInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables Save when the custom value is not a positive integer string', () => {
    renderSettingsPage()

    fireEvent.click(screen.getByRole('radio', { name: /Custom/ }))
    const customInput = screen.getByRole('spinbutton', {
      name: 'Custom round size',
    })
    fireEvent.change(customInput, { target: { value: '12a' } })

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
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
      PREFERENCES_STORAGE_KEY,
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
})
