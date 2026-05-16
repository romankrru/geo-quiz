import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Country } from '@entities/country/model/country.types'
import { settingsService } from '@entities/settings'
import { statisticsService } from '@entities/statistics'

import { useQuizRound } from './useQuizRound'

const TEST_COUNTRIES: Country[] = [
  { id: 'AA', name: 'Aland', flagEmoji: '🇦🇦' },
  { id: 'BB', name: 'Bland', flagEmoji: '🇧🇧' },
  { id: 'CC', name: 'Cland', flagEmoji: '🇨🇨' },
  { id: 'DD', name: 'Dland', flagEmoji: '🇩🇩' },
  { id: 'EE', name: 'Eland', flagEmoji: '🇪🇪' },
  { id: 'FF', name: 'Fland', flagEmoji: '🇫🇫' },
]

const FIXED_NOW = '2026-05-16T00:00:00.000Z'

function pickWrongOption(options: string[], correctAnswer: string): string {
  const wrong = options.find((o) => o !== correctAnswer)
  if (wrong === undefined) {
    throw new Error('test fixture invariant: a question must have a distractor')
  }
  return wrong
}

describe('useQuizRound', () => {
  let appendSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date(FIXED_NOW))
    appendSpy = vi
      .spyOn(statisticsService, 'appendSession')
      .mockImplementation(() => {})
    settingsService.write({
      round: { kind: 'fixed', value: 3 },
      sfxEnabled: false,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('starts a round of the Configured round size in playing status', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))

    expect(result.current.questions).toHaveLength(3)
    expect(result.current.status).toBe('playing')
    expect(result.current.score).toBe(0)
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.selectedAnswer).toBeNull()
  })

  it('returns { correct: true } and increments score on a correct answer', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))
    const correct = result.current.questions[0].correctAnswer

    let outcome: { correct: boolean } | undefined
    act(() => {
      outcome = result.current.selectAnswer(correct)
    })

    expect(outcome).toEqual({ correct: true })
    expect(result.current.score).toBe(1)
    expect(result.current.selectedAnswer).toBe(correct)
  })

  it('returns { correct: false } and does not increment score on a wrong answer', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))
    const wrong = pickWrongOption(
      result.current.questions[0].options,
      result.current.questions[0].correctAnswer,
    )

    let outcome: { correct: boolean } | undefined
    act(() => {
      outcome = result.current.selectAnswer(wrong)
    })

    expect(outcome).toEqual({ correct: false })
    expect(result.current.score).toBe(0)
    expect(result.current.selectedAnswer).toBe(wrong)
  })

  it('appends one Quiz session record when the last answer is submitted', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))
    const total = result.current.questions.length

    act(() => {
      vi.advanceTimersByTime(5_000)
    })

    for (let i = 0; i < total; i++) {
      const correct = result.current.questions[i].correctAnswer
      act(() => {
        result.current.selectAnswer(correct)
      })
      if (i < total - 1) {
        act(() => {
          result.current.next()
        })
      }
    }

    expect(result.current.status).toBe('finished')
    expect(appendSpy).toHaveBeenCalledTimes(1)
    expect(appendSpy).toHaveBeenCalledWith({
      completedAt: new Date(Date.parse(FIXED_NOW) + 5_000).toISOString(),
      score: total,
      questionCount: total,
      roundDurationMs: 5_000,
    })
  })

  it('captures Round duration (recorded) at the moment of the last selection', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))
    const total = result.current.questions.length

    for (let i = 0; i < total - 1; i++) {
      act(() => {
        result.current.selectAnswer(result.current.questions[i].correctAnswer)
      })
      act(() => {
        result.current.next()
      })
    }

    act(() => {
      vi.advanceTimersByTime(3_000)
    })
    act(() => {
      result.current.selectAnswer(
        result.current.questions[total - 1].correctAnswer,
      )
    })

    expect(appendSpy).toHaveBeenCalledWith(
      expect.objectContaining({ roundDurationMs: 3_000 }),
    )

    // Time spent on the results screen does not extend the recorded duration.
    act(() => {
      vi.advanceTimersByTime(10_000)
    })
    expect(appendSpy).toHaveBeenCalledTimes(1)
  })

  it('records the final score even when the last answer itself is correct', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))
    const total = result.current.questions.length

    for (let i = 0; i < total - 1; i++) {
      const wrong = pickWrongOption(
        result.current.questions[i].options,
        result.current.questions[i].correctAnswer,
      )
      act(() => {
        result.current.selectAnswer(wrong)
      })
      act(() => {
        result.current.next()
      })
    }
    act(() => {
      result.current.selectAnswer(
        result.current.questions[total - 1].correctAnswer,
      )
    })

    expect(appendSpy).toHaveBeenCalledWith(
      expect.objectContaining({ score: 1, questionCount: total }),
    )
    expect(result.current.score).toBe(1)
  })

  it('play-again resets state and re-reads the Configured round size', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))
    expect(result.current.questions).toHaveLength(3)

    const total = result.current.questions.length
    for (let i = 0; i < total; i++) {
      act(() => {
        result.current.selectAnswer(result.current.questions[i].correctAnswer)
      })
      if (i < total - 1) {
        act(() => {
          result.current.next()
        })
      }
    }
    expect(result.current.status).toBe('finished')

    settingsService.write({
      round: { kind: 'fixed', value: 5 },
      sfxEnabled: false,
    })
    act(() => {
      result.current.playAgain()
    })

    expect(result.current.status).toBe('playing')
    expect(result.current.questions).toHaveLength(5)
    expect(result.current.score).toBe(0)
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.selectedAnswer).toBeNull()
  })

  it('resolves all-countries against the current catalog size on play-again', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))

    settingsService.write({
      round: { kind: 'all-countries' },
      sfxEnabled: false,
    })

    act(() => {
      result.current.playAgain()
    })

    expect(result.current.questions).toHaveLength(TEST_COUNTRIES.length)
  })

  it('does not resize an in-flight round when the Configured round size changes', () => {
    const { result } = renderHook(() => useQuizRound(TEST_COUNTRIES))
    const initialQuestions = result.current.questions
    expect(initialQuestions).toHaveLength(3)

    settingsService.write({
      round: { kind: 'fixed', value: 5 },
      sfxEnabled: false,
    })

    expect(result.current.questions).toBe(initialQuestions)
    expect(result.current.questions).toHaveLength(3)
    expect(result.current.status).toBe('playing')
  })
})
