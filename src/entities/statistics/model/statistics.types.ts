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
