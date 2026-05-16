import { useCallback, useState } from 'react'

import type { Country } from '@entities/country/model/country.types'
import { type QuizQuestion, quizService } from '@entities/quiz'
import { settingsService } from '@entities/settings'
import { statisticsService } from '@entities/statistics'
import { useStopwatch } from '@shared/hooks'

export type RoundStatus = 'playing' | 'finished'

export type SelectAnswerResult = { correct: boolean }

export type UseQuizRoundReturn = {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  score: number
  selectedAnswer: string | null
  status: RoundStatus
  elapsedMs: number
  selectAnswer: (answer: string) => SelectAnswerResult
  next: () => void
  playAgain: () => void
}

function generateQuestionsForRound(countries: Country[]): QuizQuestion[] {
  const count = settingsService.resolveQuestionCount(
    settingsService.read().round,
    countries.length,
  )
  return quizService.generateQuizQuestions(countries, count)
}

/**
 * Round coordinator: owns the Completed quiz (recorded) / Round duration
 * (recorded) lifecycle. Reads the Configured round size from the Quiz
 * preferences store once at round start and once on play-again; mid-round
 * preference writes do not alter the in-flight round.
 */
export function useQuizRound(countries: Country[]): UseQuizRoundReturn {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    generateQuestionsForRound(countries),
  )
  const [status, setStatus] = useState<RoundStatus>('playing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const elapsedMs = useStopwatch(status === 'playing')

  const selectAnswer = useCallback(
    (answer: string): SelectAnswerResult => {
      const question = questions[currentQuestionIndex]
      const correct = quizService.isCorrectAnswer(question, answer)
      setSelectedAnswer(answer)
      if (correct) {
        setScore((s) => s + 1)
      }
      const isLast = currentQuestionIndex === questions.length - 1
      if (isLast) {
        const finalScore = correct ? score + 1 : score
        statisticsService.appendSession({
          completedAt: new Date().toISOString(),
          score: finalScore,
          questionCount: questions.length,
          roundDurationMs: Math.round(elapsedMs),
        })
        setStatus('finished')
      }
      return { correct }
    },
    [questions, currentQuestionIndex, score, elapsedMs],
  )

  const next = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1)
      setSelectedAnswer(null)
    }
  }, [currentQuestionIndex, questions.length])

  const playAgain = useCallback(() => {
    setQuestions(generateQuestionsForRound(countries))
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setStatus('playing')
  }, [countries])

  return {
    questions,
    currentQuestionIndex,
    score,
    selectedAnswer,
    status,
    elapsedMs,
    selectAnswer,
    next,
    playAgain,
  }
}
