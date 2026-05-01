import type { Country } from '@entities/country/model/country.types'
import type { QuizQuestion } from './quiz.types'

function generateQuizQuestions(
  countries: Country[],
  questionCount = 10,
): QuizQuestion[] {
  const shuffled = [...countries].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, questionCount)

  return selected.map((country) => {
    const distractors = countries
      .filter((c) => c.id !== country.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.name)

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
}

function isCorrectAnswer(
  question: QuizQuestion,
  selectedAnswer: string,
): boolean {
  return selectedAnswer === question.correctAnswer
}

export const quizService = {
  generateQuizQuestions,
  isCorrectAnswer,
}
