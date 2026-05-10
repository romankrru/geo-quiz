export type QuizSessionRecord = {
  completedAt: string
  score: number
  questionCount: number
  roundDurationMs: number
}

export type PersistedPayload = {
  schemaVersion: number
  sessions: QuizSessionRecord[]
}

/** Result of reading the persisted statistics store (see issue #7). */
export type StatisticsStoreReadResult =
  | { status: 'ok'; sessions: QuizSessionRecord[] }
  | { status: 'corrupted' }
  | { status: 'outdated-client'; persistedSchemaVersion: number }
