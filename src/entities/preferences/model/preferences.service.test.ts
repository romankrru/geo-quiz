import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_SETTINGS,
  PREFERENCES_STORAGE_KEY,
} from './preferences.constants'
import { preferencesService } from './preferences.service'

const defaultPrefs = () => ({
  round: { kind: 'fixed' as const, value: DEFAULT_SETTINGS.fixedRoundSize },
  sfxEnabled: DEFAULT_SETTINGS.sfxEnabled,
})

describe('Quiz preferences store: read and write', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('returns the default AppPreferences when nothing is stored', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem')

    expect(preferencesService.read()).toEqual(defaultPrefs())
    expect(setSpy).not.toHaveBeenCalled()

    setSpy.mockRestore()
  })

  it('falls back to the default when the persisted blob is not JSON', () => {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, '{not json')

    expect(preferencesService.read()).toEqual(defaultPrefs())
  })

  it('falls back to the default when the persisted shape does not match', () => {
    localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        round: { kind: 'fixed', value: -3 },
        sfxEnabled: false,
      }),
    )

    expect(preferencesService.read()).toEqual(defaultPrefs())
  })

  it('falls back to the default for the legacy top-level round shape', () => {
    localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({ kind: 'fixed', value: 25 }),
    )

    expect(preferencesService.read()).toEqual(defaultPrefs())
  })

  it('round-trips round and sfx', () => {
    preferencesService.write({
      round: { kind: 'fixed', value: 25 },
      sfxEnabled: true,
    })

    expect(preferencesService.read()).toEqual({
      round: { kind: 'fixed', value: 25 },
      sfxEnabled: true,
    })
  })

  it('round-trips the All countries in catalog intent', () => {
    preferencesService.write({
      round: { kind: 'all-countries' },
      sfxEnabled: false,
    })

    expect(preferencesService.read()).toEqual({
      round: { kind: 'all-countries' },
      sfxEnabled: false,
    })
  })

  it('logs storage errors on write without throwing', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const setSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota')
      })

    try {
      expect(() =>
        preferencesService.write({
          round: { kind: 'fixed', value: 25 },
          sfxEnabled: false,
        }),
      ).not.toThrow()
      expect(consoleSpy).toHaveBeenCalled()
    } finally {
      setSpy.mockRestore()
      consoleSpy.mockRestore()
    }
  })
})

describe('Quiz preferences store: resolve question count', () => {
  it('returns the fixed value for the fixed intent', () => {
    expect(
      preferencesService.resolveQuestionCount(
        { kind: 'fixed', value: 17 },
        197,
      ),
    ).toBe(17)
  })

  it('returns the live catalog size for the all-countries intent', () => {
    expect(
      preferencesService.resolveQuestionCount({ kind: 'all-countries' }, 197),
    ).toBe(197)

    expect(
      preferencesService.resolveQuestionCount({ kind: 'all-countries' }, 198),
    ).toBe(198)
  })
})

describe('formatApproxRoundMinutesLabel', () => {
  it('uses ~1 min per 10 questions, rounded, with a 1-minute floor', () => {
    expect(preferencesService.formatApproxRoundMinutesLabel(10)).toBe('≈ 1 min')
    expect(preferencesService.formatApproxRoundMinutesLabel(25)).toBe('≈ 3 min')
    expect(preferencesService.formatApproxRoundMinutesLabel(1)).toBe('≈ 1 min')
  })
})

describe('isValidCustomRoundSize', () => {
  const catalogSize = 197

  it('rejects zero and negatives', () => {
    expect(preferencesService.isValidCustomRoundSize(0, catalogSize)).toBe(
      false,
    )
    expect(preferencesService.isValidCustomRoundSize(-1, catalogSize)).toBe(
      false,
    )
  })

  it('accepts the lower bound', () => {
    expect(preferencesService.isValidCustomRoundSize(1, catalogSize)).toBe(true)
  })

  it('accepts the catalog size', () => {
    expect(
      preferencesService.isValidCustomRoundSize(catalogSize, catalogSize),
    ).toBe(true)
  })

  it('rejects values past the catalog size', () => {
    expect(
      preferencesService.isValidCustomRoundSize(catalogSize + 1, catalogSize),
    ).toBe(false)
  })

  it('rejects non-integer floats and NaN', () => {
    expect(preferencesService.isValidCustomRoundSize(3.5, catalogSize)).toBe(
      false,
    )
    expect(preferencesService.isValidCustomRoundSize(NaN, catalogSize)).toBe(
      false,
    )
  })
})

describe('clampCustomRoundSize', () => {
  const catalogSize = 197

  it('clamps below-range integers to 1', () => {
    expect(preferencesService.clampCustomRoundSize(0, catalogSize)).toBe(1)
    expect(preferencesService.clampCustomRoundSize(-5, catalogSize)).toBe(1)
  })

  it('clamps above-range integers to the catalog size', () => {
    expect(
      preferencesService.clampCustomRoundSize(catalogSize + 1, catalogSize),
    ).toBe(catalogSize)
    expect(preferencesService.clampCustomRoundSize(10_000, catalogSize)).toBe(
      catalogSize,
    )
  })

  it('returns in-range integers unchanged', () => {
    expect(preferencesService.clampCustomRoundSize(50, catalogSize)).toBe(50)
    expect(preferencesService.clampCustomRoundSize(1, catalogSize)).toBe(1)
    expect(
      preferencesService.clampCustomRoundSize(catalogSize, catalogSize),
    ).toBe(catalogSize)
  })

  it('rounds finite floats to the nearest integer before clamping', () => {
    expect(preferencesService.clampCustomRoundSize(5.4, catalogSize)).toBe(5)
    expect(preferencesService.clampCustomRoundSize(5.6, catalogSize)).toBe(6)
    expect(preferencesService.clampCustomRoundSize(0.4, catalogSize)).toBe(1)
    expect(
      preferencesService.clampCustomRoundSize(catalogSize + 0.6, catalogSize),
    ).toBe(catalogSize)
  })

  it('falls back to 1 for non-finite inputs', () => {
    expect(preferencesService.clampCustomRoundSize(NaN, catalogSize)).toBe(1)
    expect(preferencesService.clampCustomRoundSize(Infinity, catalogSize)).toBe(
      1,
    )
  })
})

describe('configuredRoundSizesEqual', () => {
  it('returns true for identical fixed values', () => {
    expect(
      preferencesService.configuredRoundSizesEqual(
        { kind: 'fixed', value: 10 },
        { kind: 'fixed', value: 10 },
      ),
    ).toBe(true)
  })

  it('returns false when fixed values differ', () => {
    expect(
      preferencesService.configuredRoundSizesEqual(
        { kind: 'fixed', value: 10 },
        { kind: 'fixed', value: 25 },
      ),
    ).toBe(false)
  })

  it('returns true for two all-countries intents', () => {
    expect(
      preferencesService.configuredRoundSizesEqual(
        { kind: 'all-countries' },
        { kind: 'all-countries' },
      ),
    ).toBe(true)
  })

  it('returns false when kinds differ', () => {
    expect(
      preferencesService.configuredRoundSizesEqual(
        { kind: 'fixed', value: 10 },
        { kind: 'all-countries' },
      ),
    ).toBe(false)
  })
})

describe('parsePositiveIntegerDigits', () => {
  it('parses a non-empty digit string', () => {
    expect(preferencesService.parsePositiveIntegerDigits(' 17 ')).toBe(17)
  })

  it('returns null for empty or non-digit strings', () => {
    expect(preferencesService.parsePositiveIntegerDigits('')).toBe(null)
    expect(preferencesService.parsePositiveIntegerDigits('12a')).toBe(null)
  })
})

describe('persistedToSelection', () => {
  it('maps all-countries, 10, 25, and other fixed values', () => {
    expect(
      preferencesService.persistedToSelection({ kind: 'all-countries' }),
    ).toEqual({ selection: 'all', customDigits: '' })
    expect(
      preferencesService.persistedToSelection({ kind: 'fixed', value: 10 }),
    ).toEqual({ selection: 'ten', customDigits: '' })
    expect(
      preferencesService.persistedToSelection({ kind: 'fixed', value: 25 }),
    ).toEqual({ selection: 'twenty_five', customDigits: '' })
    expect(
      preferencesService.persistedToSelection({ kind: 'fixed', value: 17 }),
    ).toEqual({ selection: 'custom', customDigits: '17' })
  })
})

describe('intentFromSelection', () => {
  const catalogSize = 197

  it('maps presets and all-countries', () => {
    expect(
      preferencesService.intentFromSelection('ten', '', catalogSize),
    ).toEqual({ kind: 'fixed', value: 10 })
    expect(
      preferencesService.intentFromSelection('twenty_five', '', catalogSize),
    ).toEqual({ kind: 'fixed', value: 25 })
    expect(
      preferencesService.intentFromSelection('all', '', catalogSize),
    ).toEqual({ kind: 'all-countries' })
  })

  it('maps a valid custom digit string to fixed', () => {
    expect(
      preferencesService.intentFromSelection('custom', '42', catalogSize),
    ).toEqual({ kind: 'fixed', value: 42 })
  })

  it('falls back to 10 when custom is invalid for the catalog', () => {
    expect(
      preferencesService.intentFromSelection(
        'custom',
        String(catalogSize + 1),
        catalogSize,
      ),
    ).toEqual({ kind: 'fixed', value: 10 })
    expect(
      preferencesService.intentFromSelection('custom', '', catalogSize),
    ).toEqual({ kind: 'fixed', value: 10 })
  })
})
