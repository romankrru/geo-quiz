import {
  MIN_SUPPORTED_STATISTICS_SCHEMA_VERSION,
  STATISTICS_STORAGE_KEY,
  STATISTICS_STORE_CHANGED_EVENT,
  STATISTICS_STORE_SCHEMA_VERSION,
} from './statistics.constants'
import {
  persistedStatisticsFromStorageStringSchema,
  quizSessionRecordArraySchema,
  quizSessionRecordSchema,
} from './statistics.schema'
import type {
  PersistedPayload,
  QuizSessionRecord,
  StatisticsStoreReadResult,
} from './statistics.types'

/**
 * Whether `candidate` beats `incumbent` for best-score selection: higher
 * score/questionCount ratio (via cross-multiplication), then larger questionCount on a tie.
 */
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

/** Session with at least one question and every answer correct. */
function isPerfectSession(session: QuizSessionRecord): boolean {
  return session.questionCount > 0 && session.score === session.questionCount
}

function readPersistedStatistics(
  raw: string | null,
): StatisticsStoreReadResult {
  if (raw === null) {
    return { status: 'ok', sessions: [] }
  }

  const envelope = persistedStatisticsFromStorageStringSchema.safeParse(raw)
  if (!envelope.success) {
    return { status: 'corrupted' }
  }

  const { schemaVersion, sessions: sessionsRaw } = envelope.data
  if (schemaVersion > STATISTICS_STORE_SCHEMA_VERSION) {
    return {
      status: 'outdated-client',
      persistedSchemaVersion: schemaVersion,
    }
  }
  if (schemaVersion < MIN_SUPPORTED_STATISTICS_SCHEMA_VERSION) {
    return { status: 'corrupted' }
  }

  const sessions = quizSessionRecordArraySchema.safeParse(sessionsRaw)
  if (!sessions.success) {
    return { status: 'corrupted' }
  }

  return { status: 'ok', sessions: sessions.data }
}

function persistStatistics(sessions: QuizSessionRecord[]): boolean {
  const payload: PersistedPayload = {
    schemaVersion: STATISTICS_STORE_SCHEMA_VERSION,
    sessions,
  }
  try {
    localStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export const statisticsService = {
  read(): StatisticsStoreReadResult {
    return readPersistedStatistics(localStorage.getItem(STATISTICS_STORAGE_KEY))
  },

  appendSession(record: QuizSessionRecord): void {
    if (!quizSessionRecordSchema.safeParse(record).success) {
      return
    }
    const raw = localStorage.getItem(STATISTICS_STORAGE_KEY)
    const state = readPersistedStatistics(raw)
    if (state.status === 'outdated-client') {
      return
    }
    const sessions =
      state.status === 'ok' ? [...state.sessions, record] : [record]
    if (persistStatistics(sessions)) {
      window.dispatchEvent(new Event(STATISTICS_STORE_CHANGED_EVENT))
    }
  },

  clear(): void {
    const raw = localStorage.getItem(STATISTICS_STORAGE_KEY)
    const state = readPersistedStatistics(raw)
    if (state.status === 'outdated-client') {
      return
    }
    localStorage.removeItem(STATISTICS_STORAGE_KEY)
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

  /** Best single-session accuracy; `null` if there is no usable session (e.g. all zero questions). */
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

  /** UI string for best score: `score / questionCount`. */
  formatBestScoreStatistics(session: {
    score: number
    questionCount: number
  }): string {
    return `${session.score} / ${session.questionCount}`
  },

  /**
   * Longest run of perfect sessions in completion-time order (stable index when timestamps tie).
   * Imperfect sessions reset the run; empty input yields `0`.
   */
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

  /** Sum of each session’s round duration (quiz start through arrival at results). */
  computeTotalRoundDurationMs(sessions: QuizSessionRecord[]): number {
    return sessions.reduce((acc, s) => acc + s.roundDurationMs, 0)
  },

  /** Human-readable total play time from summed round durations (not raw ms). */
  formatTotalTimePlayed(totalMs: number): string {
    if (totalMs <= 0) {
      return '0s'
    }
    const totalSecWhole = Math.floor(totalMs / 1000)
    const totalSec = totalSecWhole === 0 ? 1 : totalSecWhole
    if (totalSec < 60) {
      return `${totalSec}s`
    }
    const totalMin = Math.floor(totalSec / 60)
    if (totalMin < 60) {
      const sec = totalSec % 60
      return sec === 0 ? `${totalMin}m` : `${totalMin}m ${sec}s`
    }
    const hours = Math.floor(totalMin / 60)
    const min = totalMin % 60
    return min === 0 ? `${hours}h` : `${hours}h ${min}m`
  },
}
