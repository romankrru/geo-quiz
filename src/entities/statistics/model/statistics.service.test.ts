import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  STATISTICS_STORAGE_KEY,
  STATISTICS_STORE_CHANGED_EVENT,
  STATISTICS_STORE_SCHEMA_VERSION,
} from './statistics.constants'
import { statisticsService } from './statistics.service'
import type { QuizSessionRecord } from './statistics.types'

describe('persisted statistics', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('reads ok with an empty list when nothing is stored', () => {
    expect(statisticsService.read()).toEqual({ status: 'ok', sessions: [] })
  })

  it('appends a session and reads it back', () => {
    statisticsService.appendSession({
      completedAt: '2026-05-09T12:00:00.000Z',
      score: 4,
      questionCount: 10,
      roundDurationMs: 42_000,
    })

    expect(statisticsService.read()).toEqual({
      status: 'ok',
      sessions: [
        {
          completedAt: '2026-05-09T12:00:00.000Z',
          score: 4,
          questionCount: 10,
          roundDurationMs: 42_000,
        },
      ],
    })
    const raw = localStorage.getItem(STATISTICS_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toMatchObject({
      schemaVersion: STATISTICS_STORE_SCHEMA_VERSION,
    })
  })

  it('migrates schema v1 payloads on read and upgrades storage on append', () => {
    const v1Sessions = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 2,
        questionCount: 5,
        roundDurationMs: 10_000,
      },
    ]
    localStorage.setItem(
      STATISTICS_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, sessions: v1Sessions }),
    )

    expect(statisticsService.read()).toEqual({
      status: 'ok',
      sessions: v1Sessions,
    })

    statisticsService.appendSession({
      completedAt: '2026-05-09T13:00:00.000Z',
      score: 1,
      questionCount: 1,
      roundDurationMs: 5_000,
    })

    const stored = JSON.parse(
      localStorage.getItem(STATISTICS_STORAGE_KEY) ?? 'null',
    )
    expect(stored.schemaVersion).toBe(STATISTICS_STORE_SCHEMA_VERSION)
    expect(stored.sessions).toHaveLength(2)
  })

  it('treats unparsable localStorage as corrupted', () => {
    localStorage.setItem(STATISTICS_STORAGE_KEY, '{not json')

    expect(statisticsService.read()).toEqual({ status: 'corrupted' })
  })

  it('treats a newer schema version as outdated-client and blocks appends', () => {
    const futureVersion = STATISTICS_STORE_SCHEMA_VERSION + 1
    localStorage.setItem(
      STATISTICS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: futureVersion,
        sessions: [
          {
            completedAt: '2026-05-09T12:00:00.000Z',
            score: 1,
            questionCount: 1,
            roundDurationMs: 1,
          },
        ],
      }),
    )

    expect(statisticsService.read()).toEqual({
      status: 'outdated-client',
      persistedSchemaVersion: futureVersion,
    })

    const setSpy = vi.spyOn(Storage.prototype, 'setItem')
    statisticsService.appendSession({
      completedAt: '2026-05-09T14:00:00.000Z',
      score: 9,
      questionCount: 10,
      roundDurationMs: 20_000,
    })

    expect(setSpy).not.toHaveBeenCalled()
    setSpy.mockRestore()

    expect(statisticsService.read()).toEqual({
      status: 'outdated-client',
      persistedSchemaVersion: futureVersion,
    })
  })

  it('does not clear localStorage when the store is from a newer client', () => {
    const futureVersion = STATISTICS_STORE_SCHEMA_VERSION + 5
    const payload = JSON.stringify({
      schemaVersion: futureVersion,
      sessions: [],
    })
    localStorage.setItem(STATISTICS_STORAGE_KEY, payload)

    statisticsService.clear()

    expect(localStorage.getItem(STATISTICS_STORAGE_KEY)).toBe(payload)
  })

  it('treats unsupported low schema versions as corrupted', () => {
    localStorage.setItem(
      STATISTICS_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 0, sessions: [] }),
    )

    expect(statisticsService.read()).toEqual({ status: 'corrupted' })
  })

  it('treats malformed session rows as corrupted', () => {
    localStorage.setItem(
      STATISTICS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: STATISTICS_STORE_SCHEMA_VERSION,
        sessions: [
          {
            completedAt: 'x',
            score: 'nope',
            questionCount: 1,
            roundDurationMs: 1,
          },
        ],
      }),
    )

    expect(statisticsService.read()).toEqual({ status: 'corrupted' })
  })

  it('does not append invalid session records', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem')
    statisticsService.appendSession({
      completedAt: '',
      score: 1,
      questionCount: 1,
      roundDurationMs: 1,
    })

    expect(setSpy).not.toHaveBeenCalled()
    setSpy.mockRestore()
  })

  it('does not dispatch when persist fails', () => {
    const listener = vi.fn()
    window.addEventListener(STATISTICS_STORE_CHANGED_EVENT, listener)
    const setSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota')
      })

    try {
      statisticsService.appendSession({
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 1,
        questionCount: 1,
        roundDurationMs: 1,
      })
    } finally {
      setSpy.mockRestore()
      window.removeEventListener(STATISTICS_STORE_CHANGED_EVENT, listener)
    }

    expect(listener).not.toHaveBeenCalled()
  })

  it('clears every recorded quiz session record', () => {
    statisticsService.appendSession({
      completedAt: '2026-05-09T12:00:00.000Z',
      score: 4,
      questionCount: 10,
      roundDurationMs: 42_000,
    })
    statisticsService.appendSession({
      completedAt: '2026-05-09T12:30:00.000Z',
      score: 7,
      questionCount: 10,
      roundDurationMs: 60_000,
    })

    statisticsService.clear()

    expect(statisticsService.read()).toEqual({ status: 'ok', sessions: [] })
  })

  it('notifies listeners when the statistics store is cleared', () => {
    const listener = vi.fn()
    window.addEventListener(STATISTICS_STORE_CHANGED_EVENT, listener)

    try {
      statisticsService.clear()
    } finally {
      window.removeEventListener(STATISTICS_STORE_CHANGED_EVENT, listener)
    }

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('replaces corrupted storage with a valid payload after append', () => {
    localStorage.setItem(STATISTICS_STORAGE_KEY, 'not-json')
    statisticsService.appendSession({
      completedAt: '2026-05-09T12:00:00.000Z',
      score: 1,
      questionCount: 1,
      roundDurationMs: 1,
    })

    expect(statisticsService.read()).toEqual({
      status: 'ok',
      sessions: [
        {
          completedAt: '2026-05-09T12:00:00.000Z',
          score: 1,
          questionCount: 1,
          roundDurationMs: 1,
        },
      ],
    })
  })
})

describe('statistics metrics', () => {
  it('returns null for average score and overall accuracy when there are no sessions', () => {
    const sessions: QuizSessionRecord[] = []

    expect(statisticsService.computeAverageScoreStatistics(sessions)).toBeNull()
    expect(
      statisticsService.computeOverallAccuracyStatistics(sessions),
    ).toBeNull()
  })

  it('matches a single session’s accuracy for both metrics', () => {
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 60_000,
      },
    ]

    expect(statisticsService.computeAverageScoreStatistics(sessions)).toBe(70)
    expect(statisticsService.computeOverallAccuracyStatistics(sessions)).toBe(
      70,
    )
  })

  it('splits average score and overall accuracy when round lengths differ', () => {
    const sessions: QuizSessionRecord[] = [
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
    ]

    expect(statisticsService.computeAverageScoreStatistics(sessions)).toBe(50)
    expect(
      statisticsService.computeOverallAccuracyStatistics(sessions),
    ).toBeCloseTo((1 / 11) * 100, 10)
  })

  it('formats statistics percentage display with two fractional digits', () => {
    expect(statisticsService.formatStatisticsPercentage(12.345)).toBe('12.35%')
    expect(statisticsService.formatStatisticsPercentage(7)).toBe('7.00%')
  })
})

describe('best score statistics', () => {
  it('returns null when there are no sessions', () => {
    expect(statisticsService.computeBestScoreStatistics([])).toBeNull()
  })

  it('returns null when every session has zero questions', () => {
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 0,
        questionCount: 0,
        roundDurationMs: 1_000,
      },
    ]
    expect(statisticsService.computeBestScoreStatistics(sessions)).toBeNull()
  })

  it('selects the only session as best score', () => {
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 60_000,
      },
    ]
    expect(statisticsService.computeBestScoreStatistics(sessions)).toEqual({
      score: 7,
      questionCount: 10,
    })
  })

  it('tie-breaks equal accuracy with the larger question count', () => {
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 3,
        questionCount: 5,
        roundDurationMs: 1_000,
      },
      {
        completedAt: '2026-05-09T12:01:00.000Z',
        score: 6,
        questionCount: 10,
        roundDurationMs: 2_000,
      },
    ]
    expect(statisticsService.computeBestScoreStatistics(sessions)).toEqual({
      score: 6,
      questionCount: 10,
    })
  })

  it('prefers higher accuracy when ratios differ', () => {
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 8,
        questionCount: 10,
        roundDurationMs: 1_000,
      },
      {
        completedAt: '2026-05-09T12:01:00.000Z',
        score: 7,
        questionCount: 10,
        roundDurationMs: 2_000,
      },
    ]
    expect(statisticsService.computeBestScoreStatistics(sessions)).toEqual({
      score: 8,
      questionCount: 10,
    })
  })

  it('formats best score as score divided by question count', () => {
    expect(
      statisticsService.formatBestScoreStatistics({
        score: 9,
        questionCount: 10,
      }),
    ).toBe('9 / 10')
  })
})

describe('best streak statistics', () => {
  it('returns zero when there are no sessions', () => {
    expect(statisticsService.computeBestStreakStatistics([])).toBe(0)
  })

  it('returns zero when no session is perfect', () => {
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 9,
        questionCount: 10,
        roundDurationMs: 1_000,
      },
    ]
    expect(statisticsService.computeBestStreakStatistics(sessions)).toBe(0)
  })

  it('counts consecutive perfect sessions in completion order', () => {
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 10,
        questionCount: 10,
        roundDurationMs: 1_000,
      },
      {
        completedAt: '2026-05-09T12:30:00.000Z',
        score: 5,
        questionCount: 5,
        roundDurationMs: 2_000,
      },
    ]
    expect(statisticsService.computeBestStreakStatistics(sessions)).toBe(2)
  })

  it('resets the streak after an imperfect session', () => {
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: '2026-05-09T12:00:00.000Z',
        score: 10,
        questionCount: 10,
        roundDurationMs: 1_000,
      },
      {
        completedAt: '2026-05-09T12:10:00.000Z',
        score: 8,
        questionCount: 10,
        roundDurationMs: 2_000,
      },
      {
        completedAt: '2026-05-09T12:20:00.000Z',
        score: 10,
        questionCount: 10,
        roundDurationMs: 3_000,
      },
    ]
    expect(statisticsService.computeBestStreakStatistics(sessions)).toBe(1)
  })

  it('orders identical timestamps by session list index for a reproducible streak', () => {
    const sameTime = '2026-05-09T12:00:00.000Z'
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: sameTime,
        score: 10,
        questionCount: 10,
        roundDurationMs: 1_000,
      },
      {
        completedAt: sameTime,
        score: 8,
        questionCount: 10,
        roundDurationMs: 2_000,
      },
      {
        completedAt: sameTime,
        score: 10,
        questionCount: 10,
        roundDurationMs: 3_000,
      },
    ]
    expect(statisticsService.computeBestStreakStatistics(sessions)).toBe(1)
  })

  it('chains perfect runs that share the same completion timestamp using list order', () => {
    const sameTime = '2026-05-09T12:00:00.000Z'
    const sessions: QuizSessionRecord[] = [
      {
        completedAt: sameTime,
        score: 3,
        questionCount: 3,
        roundDurationMs: 1_000,
      },
      {
        completedAt: sameTime,
        score: 2,
        questionCount: 2,
        roundDurationMs: 2_000,
      },
    ]
    expect(statisticsService.computeBestStreakStatistics(sessions)).toBe(2)
  })
})

describe('total time played', () => {
  it('sums round durations across quiz session records', () => {
    expect(statisticsService.computeTotalRoundDurationMs([])).toBe(0)

    expect(
      statisticsService.computeTotalRoundDurationMs([
        {
          completedAt: '2026-05-09T12:00:00.000Z',
          score: 1,
          questionCount: 1,
          roundDurationMs: 45_000,
        },
        {
          completedAt: '2026-05-09T12:05:00.000Z',
          score: 1,
          questionCount: 1,
          roundDurationMs: 30_000,
        },
      ]),
    ).toBe(75_000)
  })

  it('formats zero total ms without exposing raw milliseconds', () => {
    expect(statisticsService.formatTotalTimePlayed(0)).toBe('0s')
  })

  it('formats minute-scale totals readably', () => {
    expect(statisticsService.formatTotalTimePlayed(90_000)).toBe('1m 30s')
    expect(statisticsService.formatTotalTimePlayed(120_000)).toBe('2m')
  })

  it('formats hour-scale totals readably', () => {
    expect(statisticsService.formatTotalTimePlayed(3_600_000)).toBe('1h')
    expect(statisticsService.formatTotalTimePlayed(5_400_000)).toBe('1h 30m')
  })
})
