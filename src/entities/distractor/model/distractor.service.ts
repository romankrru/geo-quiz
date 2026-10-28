import type { Country } from '@entities/country'

import flagSimilarities from './flag-similarity.data.json'
import forbiddenPairs from './forbidden-pairs.data.json'

type PickDistractorsInput = {
  correctCountryId: string
  candidates: Country[]
  random?: () => number
}

export const distractorService = {
  pickDistractors(input: PickDistractorsInput): Country[] {
    const random = input.random ?? Math.random
    const candidates = input.candidates.filter(
      ({ id }) =>
        id !== input.correctCountryId &&
        !forbiddenPairs.some(
          ([first, second]) =>
            (first === input.correctCountryId && second === id) ||
            (second === input.correctCountryId && first === id),
        ),
    )

    if (candidates.length < 3) {
      throw new Error('At least three eligible distractors are required')
    }

    const weightedCandidates = candidates.map((country) => {
      const similarity = Number(
        flagSimilarities.find(
          ([first, second]) =>
            (first === input.correctCountryId && second === country.id) ||
            (second === input.correctCountryId && first === country.id),
        )?.[2] ?? 0,
      )

      return {
        country,
        weight: (0.08 + similarity ** 2) * (0.85 + random() * 0.3),
      }
    })
    const distractors: Country[] = []

    while (distractors.length < 3) {
      const totalWeight = weightedCandidates.reduce(
        (total, candidate) => total + candidate.weight,
        0,
      )
      let threshold = random() * totalWeight
      let selectedIndex = weightedCandidates.length - 1

      for (let index = 0; index < weightedCandidates.length; index += 1) {
        threshold -= weightedCandidates[index].weight
        if (threshold < 0) {
          selectedIndex = index
          break
        }
      }

      distractors.push(weightedCandidates.splice(selectedIndex, 1)[0].country)
    }

    return distractors
  },
}
