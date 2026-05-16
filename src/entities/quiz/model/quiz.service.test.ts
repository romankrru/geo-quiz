import { describe, expect, it } from 'vitest'

import { SITE_URL } from '@shared/config/config'

import { quizService } from './quiz.service'

describe('quizService.formatShareText', () => {
  it('returns the exact two-line share text for a representative input', () => {
    expect(
      quizService.formatShareText({
        score: 7,
        totalQuestions: 10,
        durationMs: 83_400,
      }),
    ).toBe(
      `🌍 My result in Geo Quiz: 7/10 in 01:23\nTry it yourself → ${SITE_URL}`,
    )
  })

  it('embeds the exported SITE_URL constant', () => {
    const text = quizService.formatShareText({
      score: 5,
      totalQuestions: 10,
      durationMs: 60_000,
    })
    expect(text).toContain(SITE_URL)
  })

  it('uses the brand line "My result in Geo Quiz" and CTA "Try it yourself →"', () => {
    const text = quizService.formatShareText({
      score: 5,
      totalQuestions: 10,
      durationMs: 60_000,
    })
    expect(text).toContain('My result in Geo Quiz')
    expect(text).toContain('Try it yourself →')
  })

  describe('duration formatting (MM:SS without tenths)', () => {
    it('formats 0 ms as 00:00', () => {
      expect(
        quizService.formatShareText({
          score: 1,
          totalQuestions: 1,
          durationMs: 0,
        }),
      ).toContain('00:00')
    })

    it('formats exactly one minute as 01:00', () => {
      expect(
        quizService.formatShareText({
          score: 1,
          totalQuestions: 1,
          durationMs: 60_000,
        }),
      ).toContain('01:00')
    })

    it('drops sub-second remainder (83_999 ms → 01:23)', () => {
      expect(
        quizService.formatShareText({
          score: 1,
          totalQuestions: 1,
          durationMs: 83_999,
        }),
      ).toContain('01:23')
    })

    it('never shows tenths (no dot in duration portion)', () => {
      const text = quizService.formatShareText({
        score: 1,
        totalQuestions: 1,
        durationMs: 83_400,
      })
      const durationPart = text.match(/in (\S+)/)?.[1] ?? ''
      expect(durationPart).not.toContain('.')
    })

    it('formats 60 minutes as 60:00 without an hours segment', () => {
      expect(
        quizService.formatShareText({
          score: 1,
          totalQuestions: 1,
          durationMs: 3_600_000,
        }),
      ).toContain('60:00')
    })
  })

  describe('score and total question rendering', () => {
    it('formats single-digit values without spaces (7/10)', () => {
      const text = quizService.formatShareText({
        score: 7,
        totalQuestions: 10,
        durationMs: 0,
      })
      expect(text).toContain('7/10')
    })

    it('formats 0/3', () => {
      expect(
        quizService.formatShareText({
          score: 0,
          totalQuestions: 3,
          durationMs: 0,
        }),
      ).toContain('0/3')
    })

    it('formats perfect score 10/10', () => {
      expect(
        quizService.formatShareText({
          score: 10,
          totalQuestions: 10,
          durationMs: 0,
        }),
      ).toContain('10/10')
    })

    it('formats all-countries-style large counts (253/253)', () => {
      expect(
        quizService.formatShareText({
          score: 253,
          totalQuestions: 253,
          durationMs: 0,
        }),
      ).toContain('253/253')
    })
  })
})
