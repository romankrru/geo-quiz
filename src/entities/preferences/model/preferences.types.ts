import type { AppPreferences, ConfiguredRoundSize } from './preferences.schema'

export type { AppPreferences, ConfiguredRoundSize }

/** UI preset for the settings round-size form (maps to/from `ConfiguredRoundSize`). */
export type RoundSelection = 'ten' | 'twenty_five' | 'all' | 'custom'
