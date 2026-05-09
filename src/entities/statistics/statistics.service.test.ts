import { describe, expect, it } from 'vitest'

import type { QuizSessionRecord } from './model/types'
import { statisticsService } from './statistics.service'

describe('statisticsService', () => {
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
