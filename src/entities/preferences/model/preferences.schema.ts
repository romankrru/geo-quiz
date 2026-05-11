import { z } from 'zod'

/**
 * Configured round size: discriminated intent persisted in the Quiz preferences store.
 * `fixed` carries a concrete positive integer; `all-countries` tracks the live catalog.
 */
export const configuredRoundSizeSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('fixed'),
    value: z.number().int().positive(),
  }),
  z.object({ kind: z.literal('all-countries') }),
])

export type ConfiguredRoundSize = z.infer<typeof configuredRoundSizeSchema>

/**
 * Full body from `localStorage`: valid UTF-8 JSON that matches a Configured round size.
 * Invalid JSON becomes a Zod issue (no uncaught `SyntaxError` from `JSON.parse`).
 */
export const persistedPreferencesFromStorageStringSchema = z
  .string()
  .transform((str, ctx) => {
    try {
      return JSON.parse(str) as unknown
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return str
    }
  })
  .pipe(configuredRoundSizeSchema)
