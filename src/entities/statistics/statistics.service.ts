import type { QuizSessionRecord } from './model/types'

const computeAverageScoreStatistics = (
  sessions: QuizSessionRecord[],
): number | null => {
  if (sessions.length === 0) {
    return null
  }

  const sumRatios = sessions.reduce((acc, session) => {
    return acc + session.score / session.questionCount
  }, 0)

  return (sumRatios / sessions.length) * 100
}

const computeOverallAccuracyStatistics = (
  sessions: QuizSessionRecord[],
): number | null => {
  if (sessions.length === 0) {
    return null
  }

  const totalScore = sessions.reduce((acc, session) => acc + session.score, 0)
  const totalQuestions = sessions.reduce(
    (acc, session) => acc + session.questionCount,
    0,
  )

  if (totalQuestions === 0) {
    return null
  }

  return (totalScore / totalQuestions) * 100
}

const formatStatisticsPercentage = (percent: number): string => {
  return `${percent.toFixed(2)}%`
}

export const statisticsService = {
  computeAverageScoreStatistics,
  computeOverallAccuracyStatistics,
  formatStatisticsPercentage,
}
