import {
  STATISTICS_STORAGE_KEY,
  STATISTICS_STORE_CHANGED_EVENT,
  STATISTICS_STORE_SCHEMA_VERSION,
} from './statistics.constants'
import type { PersistedPayload, QuizSessionRecord } from './statistics.types'

const readSessions = (): QuizSessionRecord[] => {
  const raw = localStorage.getItem(STATISTICS_STORAGE_KEY)
  if (raw === null) {
    return []
  }
  try {
    const data = JSON.parse(raw) as PersistedPayload
    if (
      data.schemaVersion !== STATISTICS_STORE_SCHEMA_VERSION ||
      !Array.isArray(data.sessions)
    ) {
      return []
    }
    return data.sessions
  } catch {
    return []
  }
}

export const statisticsService = {
  read(): QuizSessionRecord[] {
    return readSessions()
  },

  appendSession(record: QuizSessionRecord): void {
    const sessions = [...readSessions(), record]
    localStorage.setItem(
      STATISTICS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: STATISTICS_STORE_SCHEMA_VERSION,
        sessions,
      } satisfies PersistedPayload),
    )
    window.dispatchEvent(new Event(STATISTICS_STORE_CHANGED_EVENT))
  },

  computeAverageScoreStatistics(sessions: QuizSessionRecord[]): number | null {
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
