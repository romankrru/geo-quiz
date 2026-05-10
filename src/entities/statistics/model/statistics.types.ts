import type { QuizSessionRecord } from './statistics.schema'

export type { QuizSessionRecord }

export type PersistedPayload = {
  schemaVersion: number
  sessions: QuizSessionRecord[]
}

/** Result of reading the persisted statistics store (see issue #7). */
export type StatisticsStoreReadResult =
  | { status: 'ok'; sessions: QuizSessionRecord[] }
  | { status: 'corrupted' }
  | { status: 'outdated-client'; persistedSchemaVersion: number }
