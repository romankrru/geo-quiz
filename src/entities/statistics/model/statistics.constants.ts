export const STATISTICS_STORE_CHANGED_EVENT = 'geo-quiz-stats-changed'
export const STATISTICS_STORAGE_KEY = 'geo-quiz.statistics.v1'

/** Persisted payload `schemaVersion`; bump when the on-disk shape changes. */
export const STATISTICS_STORE_SCHEMA_VERSION = 2

/** Oldest `schemaVersion` this build can load (older values are treated as corrupted). */
export const MIN_SUPPORTED_STATISTICS_SCHEMA_VERSION = 1
