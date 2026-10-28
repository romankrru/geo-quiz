import { describe, expect, it } from 'vitest'

import type { Country } from '@entities/country'

import { distractorService } from './distractor.service'

const country = (id: string): Country => ({
  id,
  name: id,
  flagEmoji: id,
})

describe('distractorService.pickDistractors', () => {
  it.each([
    ['RO', 'TD'],
    ['TD', 'RO'],
  ])('excludes %s forbidden partner %s', (correctCountryId, forbiddenId) => {
    const distractors = distractorService.pickDistractors({
      correctCountryId,
      candidates: ['RO', 'TD', 'FR', 'DE', 'ES'].map(country),
      random: () => 0,
    })

    expect(distractors).toHaveLength(3)
    expect(distractors.map(({ id }) => id)).not.toContain(forbiddenId)
  })

  it('throws when three distractors cannot be drawn', () => {
    expect(() =>
      distractorService.pickDistractors({
        correctCountryId: 'FR',
        candidates: ['DE', 'ES'].map(country),
        random: () => 0,
      }),
    ).toThrow('At least three eligible distractors are required')
  })

  it.each([
    ['SI', 'SK'],
    ['SK', 'SI'],
  ])(
    'prefers higher-similarity candidate %s to %s',
    (correctCountryId, similarCountryId) => {
      const randomValues = [0.99, 0.99, 0.99, 0.5, 0.5, 0, 0]
      const distractors = distractorService.pickDistractors({
        correctCountryId,
        candidates: ['FR', 'DE', 'ES', similarCountryId].map(country),
        random: () => randomValues.shift() ?? 0,
      })

      expect(distractors.map(({ id }) => id)).toContain(similarCountryId)
    },
  )
})
