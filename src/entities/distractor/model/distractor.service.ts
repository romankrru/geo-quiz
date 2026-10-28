import type { Country } from '@entities/country'

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

    for (let index = candidates.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1))
      ;[candidates[index], candidates[swapIndex]] = [
        candidates[swapIndex],
        candidates[index],
      ]
    }

    return candidates.slice(0, 3)
  },
}
