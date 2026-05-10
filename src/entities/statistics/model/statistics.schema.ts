import { z } from 'zod'

/** One persisted row for a completed quiz (matches domain glossary). */
export const quizSessionRecordSchema = z.object({
  completedAt: z.string().min(1),
  score: z.number().finite().nonnegative(),
  questionCount: z.number().finite().nonnegative(),
  roundDurationMs: z.number().finite().nonnegative(),
})

export type QuizSessionRecord = z.infer<typeof quizSessionRecordSchema>

/** Envelope after JSON.parse — `sessions` validated in a second step. */
export const persistedStatisticsEnvelopeSchema = z.object({
  schemaVersion: z.number().int(),
  sessions: z.unknown(),
})

/**
 * Full body from `localStorage`: valid UTF-8 JSON object with `schemaVersion` + `sessions`.
 * Invalid JSON becomes a Zod issue (no uncaught `SyntaxError` from `JSON.parse`).
 */
export const persistedStatisticsFromStorageStringSchema = z
  .string()
  .transform((str, ctx) => {
    try {
      return JSON.parse(str) as unknown
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return str
    }
  })
  .pipe(persistedStatisticsEnvelopeSchema)

export const quizSessionRecordArraySchema = z.array(quizSessionRecordSchema)
