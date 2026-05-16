import type { AppSettings, ConfiguredRoundSize } from './settings.schema'

export type { AppSettings, ConfiguredRoundSize }

/** UI preset for the settings round-size form (maps to/from `ConfiguredRoundSize`). */
export type RoundSelection = 'ten' | 'twenty_five' | 'all' | 'custom'
