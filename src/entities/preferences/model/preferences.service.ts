import {
  DEFAULT_ROUND_SIZE,
  PREFERENCES_STORAGE_KEY,
} from './preferences.constants'
import {
  configuredRoundSizeSchema,
  persistedPreferencesFromStorageStringSchema,
} from './preferences.schema'
import type { ConfiguredRoundSize } from './preferences.types'

const defaultRoundSize = (): ConfiguredRoundSize => ({
  kind: 'fixed',
  value: DEFAULT_ROUND_SIZE,
})

function readPersistedPreferences(raw: string | null): ConfiguredRoundSize {
  if (raw === null) {
    return defaultRoundSize()
  }
  const parsed = persistedPreferencesFromStorageStringSchema.safeParse(raw)
  if (!parsed.success) {
    return defaultRoundSize()
  }
  return parsed.data
}

export const preferencesService = {
  read(): ConfiguredRoundSize {
    try {
      return readPersistedPreferences(
        localStorage.getItem(PREFERENCES_STORAGE_KEY),
      )
    } catch {
      return defaultRoundSize()
    }
  },

  write(value: ConfiguredRoundSize): void {
    if (!configuredRoundSizeSchema.safeParse(value).success) {
      return
    }
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(value))
    } catch {
      // Swallow storage errors (quota, private mode, …) — consistent with statisticsService.
    }
  },

  /**
   * Concrete question count to feed `quizService.generateQuizQuestions`. For
   * `all-countries`, this reflects `catalogSize` at call time so catalog growth
   * is honoured on the next resolution.
   */
  resolveQuestionCount(
    value: ConfiguredRoundSize,
    catalogSize: number,
  ): number {
    if (value.kind === 'all-countries') {
      return catalogSize
    }
    return value.value
  },

  isValidCustomRoundSize(value: number, catalogSize: number): boolean {
    if (!Number.isInteger(value)) {
      return false
    }
    return value >= 1 && value <= catalogSize
  },

  /**
   * Clamp a custom round size onto `[1, catalogSize]`. Non-finite values fall
   * back to `1`; finite floats are rounded to the nearest integer before clamping.
   */
  clampCustomRoundSize(value: number, catalogSize: number): number {
    if (!Number.isFinite(value)) {
      return 1
    }
    const max = Math.max(1, catalogSize)
    const rounded = Math.round(value)
    if (rounded < 1) return 1
    if (rounded > max) return max
    return rounded
  },
}
