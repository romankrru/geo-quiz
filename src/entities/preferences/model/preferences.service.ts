import {
  DEFAULT_ROUND_SIZE,
  PREFERENCES_STORAGE_KEY,
} from './preferences.constants'
import {
  configuredRoundSizeSchema,
  persistedPreferencesFromStorageStringSchema,
} from './preferences.schema'
import type { ConfiguredRoundSize, RoundSelection } from './preferences.types'

export const preferencesService = {
  read(): ConfiguredRoundSize {
    try {
      const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY)
      if (raw === null) {
        return { kind: 'fixed', value: DEFAULT_ROUND_SIZE }
      }
      const parsed = persistedPreferencesFromStorageStringSchema.safeParse(raw)
      if (!parsed.success) {
        return { kind: 'fixed', value: DEFAULT_ROUND_SIZE }
      }
      return parsed.data
    } catch (error) {
      console.error(
        '[preferencesService.read] localStorage read failed; using defaults',
        error,
      )
      return { kind: 'fixed', value: DEFAULT_ROUND_SIZE }
    }
  },

  write(value: ConfiguredRoundSize): void {
    if (!configuredRoundSizeSchema.safeParse(value).success) {
      return
    }
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(value))
    } catch (error) {
      console.error(
        '[preferencesService.write] localStorage.setItem failed',
        error,
      )
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

  configuredRoundSizesEqual(
    a: ConfiguredRoundSize,
    b: ConfiguredRoundSize,
  ): boolean {
    if (a.kind !== b.kind) {
      return false
    }
    if (a.kind === 'fixed' && b.kind === 'fixed') {
      return a.value === b.value
    }
    return true
  },

  parsePositiveIntegerDigits(raw: string): number | null {
    const trimmed = raw.trim()
    if (trimmed === '') {
      return null
    }
    if (!/^\d+$/.test(trimmed)) {
      return null
    }
    return Number.parseInt(trimmed, 10)
  },

  persistedToSelection(persisted: ConfiguredRoundSize): {
    selection: RoundSelection
    customDigits: string
  } {
    if (persisted.kind === 'all-countries') {
      return { selection: 'all', customDigits: '' }
    }
    if (persisted.value === 10) {
      return { selection: 'ten', customDigits: '' }
    }
    if (persisted.value === 25) {
      return { selection: 'twenty_five', customDigits: '' }
    }
    return { selection: 'custom', customDigits: String(persisted.value) }
  },

  intentFromSelection(
    selection: RoundSelection,
    customDigits: string,
    catalogSize: number,
  ): ConfiguredRoundSize {
    if (selection === 'ten') {
      return { kind: 'fixed', value: 10 }
    }
    if (selection === 'twenty_five') {
      return { kind: 'fixed', value: 25 }
    }
    if (selection === 'all') {
      return { kind: 'all-countries' }
    }
    const trimmed = customDigits.trim()
    const parsed =
      trimmed === '' || !/^\d+$/.test(trimmed)
        ? null
        : Number.parseInt(trimmed, 10)
    if (
      parsed === null ||
      !Number.isInteger(parsed) ||
      parsed < 1 ||
      parsed > catalogSize
    ) {
      return { kind: 'fixed', value: 10 }
    }
    return { kind: 'fixed', value: parsed }
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
