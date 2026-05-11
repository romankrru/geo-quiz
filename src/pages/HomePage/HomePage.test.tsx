import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HomePage } from './HomePage'

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

describe('HomePage', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('exposes a Settings link to /settings with accessible name Settings', () => {
    render(<HomePage />)

    const settings = screen.getByRole('link', { name: 'Settings' })
    expect(settings).toHaveAttribute('href', '/settings')
  })
})
