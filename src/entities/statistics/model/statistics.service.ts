import {
  STATISTICS_STORAGE_KEY,
  STATISTICS_STORE_CHANGED_EVENT,
  STATISTICS_STORE_SCHEMA_VERSION,
} from './statistics.constants'
import type { PersistedPayload, QuizSessionRecord } from './statistics.types'

function bestScoreCandidateWins(
  candidate: QuizSessionRecord,
  incumbent: QuizSessionRecord,
): boolean {
  const lhs = candidate.score * incumbent.questionCount
  const rhs = incumbent.score * candidate.questionCount
  if (lhs !== rhs) {
    return lhs > rhs
  }
  return candidate.questionCount > incumbent.questionCount
}

function isPerfectSession(session: QuizSessionRecord): boolean {
  return session.questionCount > 0 && session.score === session.questionCount
}

export const statisticsService = {
  read(): QuizSessionRecord[] {
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
  },

  appendSession(record: QuizSessionRecord): void {
    const sessions = [...this.read(), record]
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

  computeBestScoreStatistics(
    sessions: QuizSessionRecord[],
  ): { score: number; questionCount: number } | null {
    const valid = sessions.filter((s) => s.questionCount > 0)
    if (valid.length === 0) {
      return null
    }
    const best = valid.reduce((incumbent, current) =>
      bestScoreCandidateWins(current, incumbent) ? current : incumbent,
    )
    return { score: best.score, questionCount: best.questionCount }
  },

  formatBestScoreStatistics(session: {
    score: number
    questionCount: number
  }): string {
    return `${session.score} / ${session.questionCount}`
  },

  computeBestStreakStatistics(sessions: QuizSessionRecord[]): number {
    if (sessions.length === 0) {
      return 0
    }
    const ordered = sessions
      .map((session, index) => ({ session, index }))
      .sort((a, b) => {
        const byTime = a.session.completedAt.localeCompare(
          b.session.completedAt,
        )
        if (byTime !== 0) {
          return byTime
        }
        return a.index - b.index
      })

    let maxStreak = 0
    let current = 0
    for (const { session } of ordered) {
      if (isPerfectSession(session)) {
        current++
        if (current > maxStreak) {
          maxStreak = current
        }
      } else {
        current = 0
      }
    }
    return maxStreak
  },
}
