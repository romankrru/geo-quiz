import { cleanup, render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as statistics from '@entities/statistics'

import { StatsPage } from './StatsPage'

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

function renderStatsPage() {
  render(<StatsPage />)
}

describe('StatsPage', () => {
  let readSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    localStorage.clear()
    readSpy = vi.spyOn(statistics.statisticsService, 'read').mockReturnValue([])
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows statistics empty state when there are no sessions', () => {
    renderStatsPage()

    expect(
      screen.getByText(/nothing recorded yet/i),
    ).toBeInTheDocument()
  })

  it('shows average score and overall accuracy from quiz session records', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 120_000,
      },
    ])

    renderStatsPage()

    const averageCard = screen.getByRole('group', { name: 'Average Score' })
    const overallCard = screen.getByRole('group', { name: 'Overall Accuracy' })

    expect(within(averageCard).getByText('70.00%')).toBeInTheDocument()
    expect(within(overallCard).getByText('70.00%')).toBeInTheDocument()
  })

  it('separates average score and overall accuracy when sessions have different lengths', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 1,
        questionCount: 1,
        roundDurationMs: 1_000,
      },
      {
        completedAt: '2026-05-09T12:01:00.000Z',
        score: 0,
        questionCount: 10,
        roundDurationMs: 5_000,
      },
    ])

    renderStatsPage()

    const averageCard = screen.getByRole('group', { name: 'Average Score' })
    const overallCard = screen.getByRole('group', { name: 'Overall Accuracy' })

    expect(within(averageCard).getByText('50.00%')).toBeInTheDocument()
    expect(within(overallCard).getByText('9.09%')).toBeInTheDocument()
  })
})
