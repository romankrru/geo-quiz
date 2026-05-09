import { afterEach, describe, expect, it } from 'vitest'

import { statisticsStore } from './statistics.store'

describe('statisticsStore', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('reads an empty list when nothing is stored', () => {
    expect(statisticsStore.read()).toEqual([])
  })

  it('appends a session and reads it back', () => {
    statisticsStore.appendSession({
      completedAtIso: '2026-05-09T12:00:00.000Z',
      score: 4,
      questionCount: 10,
      roundDurationMs: 42_000,
    })

    expect(statisticsStore.read()).toEqual([
      {
        completedAtIso: '2026-05-09T12:00:00.000Z',
        score: 4,
        questionCount: 10,
        roundDurationMs: 42_000,
      },
    ])
  })
})
