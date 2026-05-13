export const PREFERENCES_STORAGE_KEY = 'geo-quiz.preferences'

/** Defaults when nothing is persisted or the stored blob is invalid. */
export const DEFAULT_SETTINGS = {
  /** Default fixed round count (`{ kind: 'fixed', value }`). */
  fixedRoundSize: 10,
  sfxEnabled: false,
} as const
