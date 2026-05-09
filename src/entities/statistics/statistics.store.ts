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

const read = (): QuizSessionRecord[] => {
  return parseStored(localStorage.getItem(STORAGE_KEY))
}

const appendSession = (record: QuizSessionRecord): void => {
  const sessions = [...read(), record]
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
}

export const statisticsStore = {
  read,
  appendSession,
}
