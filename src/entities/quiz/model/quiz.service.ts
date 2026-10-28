import type { Country } from '@entities/country/model/country.types'
import { distractorService } from '@entities/distractor'
import { SITE_URL } from '@shared/config/config'

import type { QuizQuestion } from './quiz.types'

export const quizService = {
  generateQuizQuestions(
    countries: Country[],
    questionCount = 10,
  ): QuizQuestion[] {
    const shuffled = [...countries].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, questionCount)

    return selected.map((country) => {
      const distractors = distractorService
        .pickDistractors({
          correctCountryId: country.id,
          candidates: countries.filter(({ id }) => id !== country.id),
        })
        .map(({ name }) => name)

      const options = [...distractors, country.name].sort(
        () => Math.random() - 0.5,
      )

      return {
        id: country.id,
        flagEmoji: country.flagEmoji,
        options,
        correctAnswer: country.name,
      }
    })
  },

  isCorrectAnswer(question: QuizQuestion, selectedAnswer: string): boolean {
    return selectedAnswer === question.correctAnswer
  },

  /** Stopwatch-style label for a round's elapsed/finished time: `MM:SS.t`. */
  formatRoundDuration(ms: number): string {
    const totalTenths = Math.floor(ms / 100)
    const m = Math.floor(totalTenths / 600)
    const s = Math.floor((totalTenths % 600) / 10)
    const t = totalTenths % 10
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${t}`
  },

  formatShareText(input: {
    score: number
    totalQuestions: number
    durationMs: number
  }): string {
    const totalSeconds = Math.floor(input.durationMs / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    const mmss = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `🌍 My result in Geo Quiz: ${input.score}/${input.totalQuestions} in ${mmss}\nTry it yourself → ${SITE_URL}`
  },
}
