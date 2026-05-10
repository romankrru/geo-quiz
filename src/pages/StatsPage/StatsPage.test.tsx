import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
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

    expect(screen.getByText(/nothing recorded yet/i)).toBeInTheDocument()
  })

  it('hides the reset control while in the statistics empty state', () => {
    renderStatsPage()

    expect(
      screen.queryByRole('button', { name: /reset statistics/i }),
    ).not.toBeInTheDocument()
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

  it('shows best score and best streak from quiz session records', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 120_000,
      },
      {
        completedAt: '2026-05-09T12:30:00.000Z',
        score: 10,
        questionCount: 10,
        roundDurationMs: 90_000,
      },
    ])

    renderStatsPage()

    const bestScoreCard = screen.getByRole('group', { name: 'Best Score' })
    const bestStreakCard = screen.getByRole('group', { name: 'Best Streak' })

    expect(within(bestScoreCard).getByText('10 / 10')).toBeInTheDocument()
    expect(within(bestStreakCard).getByText('1')).toBeInTheDocument()
    expect(
      within(bestScoreCard).getByText(/score ÷ questions/i),
    ).toBeInTheDocument()
    expect(
      within(bestStreakCard).getByText(/one miss resets/i),
    ).toBeInTheDocument()
  })

  it('shows a best streak greater than one when perfect sessions are consecutive', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 10,
        questionCount: 10,
        roundDurationMs: 60_000,
      },
      {
        completedAt: '2026-05-09T12:30:00.000Z',
        score: 5,
        questionCount: 5,
        roundDurationMs: 30_000,
      },
    ])

    renderStatsPage()

    const bestStreakCard = screen.getByRole('group', { name: 'Best Streak' })
    expect(within(bestStreakCard).getByText('2')).toBeInTheDocument()
  })

  it('exposes a reset statistics control on the populated stats screen', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 60_000,
      },
    ])

    renderStatsPage()

    expect(
      screen.getByRole('button', { name: /reset statistics/i }),
    ).toBeInTheDocument()
  })

  it('returns to the statistics empty state after the reset is confirmed', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 60_000,
      },
    ])
    const clearSpy = vi
      .spyOn(statistics.statisticsService, 'clear')
      .mockImplementation(() => {
        readSpy.mockReturnValue([])
        window.dispatchEvent(
          new Event(statistics.STATISTICS_STORE_CHANGED_EVENT),
        )
      })

    renderStatsPage()
    fireEvent.click(screen.getByRole('button', { name: /reset statistics/i }))

    const dialog = screen.getByRole('dialog', { name: /reset statistics/i })
    fireEvent.click(within(dialog).getByRole('button', { name: /^reset$/i }))

    expect(clearSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/nothing recorded yet/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('dialog', { name: /reset statistics/i }),
    ).not.toBeInTheDocument()
  })

  it('keeps the statistics intact when the reset dialog is cancelled', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 60_000,
      },
    ])
    const clearSpy = vi.spyOn(statistics.statisticsService, 'clear')

    renderStatsPage()
    fireEvent.click(screen.getByRole('button', { name: /reset statistics/i }))

    const dialog = screen.getByRole('dialog', { name: /reset statistics/i })
    fireEvent.click(within(dialog).getByRole('button', { name: /cancel/i }))

    expect(clearSpy).not.toHaveBeenCalled()
    expect(
      screen.queryByRole('dialog', { name: /reset statistics/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Average Score' }),
    ).toBeInTheDocument()
  })

  it('opens a confirmation dialog explaining the reset is irreversible on this device', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 60_000,
      },
    ])

    renderStatsPage()
    fireEvent.click(screen.getByRole('button', { name: /reset statistics/i }))

    const dialog = screen.getByRole('dialog', { name: /reset statistics/i })
    expect(within(dialog).getByText(/can't be undone/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/this device/i)).toBeInTheDocument()
    expect(
      within(dialog).getByRole('button', { name: /^reset$/i }),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByRole('button', { name: /cancel/i }),
    ).toBeInTheDocument()
  })

  it('shows total time played from summed round durations in a readable form', () => {
    readSpy.mockReturnValue([
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 10,
        questionCount: 10,
        roundDurationMs: 60_000,
      },
      {
        completedAt: '2026-05-09T12:30:00.000Z',
        score: 10,
        questionCount: 10,
        roundDurationMs: 30_000,
      },
    ])

    renderStatsPage()

    const totalTimeCard = screen.getByRole('group', {
      name: 'Total Time Played',
    })
    expect(within(totalTimeCard).getByText('1m 30s')).toBeInTheDocument()
    expect(
      within(totalTimeCard).getByText(/idle on results not counted/i),
    ).toBeInTheDocument()
  })
})
