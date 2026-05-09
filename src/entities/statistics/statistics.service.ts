import type { QuizSessionRecord } from './model/types'

export const STATISTICS_STORE_CHANGED_EVENT = 'geo-quiz-stats-changed'

const STORAGE_KEY = 'geo-quiz.statistics.v1'
const SCHEMA_VERSION = 1

type PersistedPayload = {
  schemaVersion: number
  sessions: QuizSessionRecord[]
}

const parseStored = (raw: string | null): QuizSessionRecord[] => {
  if (raw === null) {
    return []
  }
  try {
    const data = JSON.parse(raw) as PersistedPayload
    if (
      data.schemaVersion !== SCHEMA_VERSION ||
      !Array.isArray(data.sessions)
    ) {
      return []
    }
    return data.sessions
  } catch {
    return []
  }
}

const readSessions = (): QuizSessionRecord[] => {
  return parseStored(localStorage.getItem(STORAGE_KEY))
}

export const statisticsService = {
  read(): QuizSessionRecord[] {
    return readSessions()
  },

  appendSession(record: QuizSessionRecord): void {
    const sessions = [...readSessions(), record]
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        sessions,
      } satisfies PersistedPayload),
    )
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(STATISTICS_STORE_CHANGED_EVENT))
    }
  },

  computeAverageScoreStatistics(
    sessions: QuizSessionRecord[],
  ): number | null {
    if (sessions.length === 0) {
      return null
    }

    const sumRatios = sessions.reduce((acc, session) => {
      return acc + session.score / session.questionCount
    }, 0)

    return (sumRatios / sessions.length) * 100
  },

  computeOverallAccuracyStatistics(
    sessions: QuizSessionRecord[],
  ): number | null {
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
  },

  formatStatisticsPercentage(percent: number): string {
    return `${percent.toFixed(2)}%`
  },
}
