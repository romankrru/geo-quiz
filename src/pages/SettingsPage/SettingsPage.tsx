import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { COUNTRIES } from '@entities/country/model/country.data'
import { preferencesService, type RoundSelection } from '@entities/preferences'
import { Button } from '@shared/ui/Button/Button'

import * as styles from './SettingsPage.css'

const catalogSize = COUNTRIES.length

export const SettingsPage = () => {
  const initial = useMemo(
    () =>
      preferencesService.persistedToSelection(preferencesService.read().round),
    [],
  )
  const [selection, setSelection] = useState<RoundSelection>(initial.selection)
  const [customDigits, setCustomDigits] = useState(initial.customDigits)

  const customParsed =
    preferencesService.parsePositiveIntegerDigits(customDigits)
  const customInvalid =
    selection === 'custom' &&
    (customParsed === null ||
      !preferencesService.isValidCustomRoundSize(customParsed, catalogSize))

  const saveDisabled = selection === 'custom' ? customInvalid : false

  const handleSave = () => {
    const intent = preferencesService.intentFromSelection(
      selection,
      customDigits,
      catalogSize,
    )
    const persisted = preferencesService.read()
    if (
      !preferencesService.configuredRoundSizesEqual(intent, persisted.round)
    ) {
      preferencesService.write({ ...persisted, round: intent })
      toast.success('Settings saved')
      return
    }
    toast('Already up to date')
  }

  const handleCustomBlur = () => {
    if (selection !== 'custom') {
      return
    }
    const parsed = preferencesService.parsePositiveIntegerDigits(customDigits)
    if (parsed === null) {
      return
    }
    if (preferencesService.isValidCustomRoundSize(parsed, catalogSize)) {
      return
    }
    setCustomDigits(
      String(preferencesService.clampCustomRoundSize(parsed, catalogSize)),
    )
  }

  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
        >
          <fieldset className={styles.fieldset}>
            <span>
              <legend className={styles.legend}>Round size</legend>
            </span>
            <div className={styles.radioStack}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="configured-round-size"
                  checked={selection === 'ten'}
                  onChange={() => {
                    setSelection('ten')
                  }}
                />
                10
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="configured-round-size"
                  checked={selection === 'twenty_five'}
                  onChange={() => {
                    setSelection('twenty_five')
                  }}
                />
                25
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="configured-round-size"
                  checked={selection === 'all'}
                  onChange={() => {
                    setSelection('all')
                  }}
                />
                {`All (${catalogSize})`}
              </label>
              <div className={styles.customRow}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="configured-round-size"
                    checked={selection === 'custom'}
                    onChange={() => {
                      setSelection('custom')
                    }}
                  />
                  Custom
                </label>
                <input
                  id="settings-custom-round-size"
                  className={`${styles.numberInput}${
                    selection !== 'custom'
                      ? ` ${styles.numberInputInactive}`
                      : ''
                  }${
                    customInvalid && selection === 'custom'
                      ? ` ${styles.numberInputInvalid}`
                      : ''
                  }`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={catalogSize}
                  aria-invalid={customInvalid && selection === 'custom'}
                  aria-label="Custom round size"
                  value={selection === 'custom' ? customDigits : ''}
                  onFocus={() => {
                    setSelection('custom')
                  }}
                  onChange={(event) => {
                    setCustomDigits(event.target.value)
                  }}
                  onBlur={handleCustomBlur}
                />
              </div>
            </div>
          </fieldset>
          <div className={styles.formActions}>
            <Button
              as={Link}
              to="/"
              variant="transparent"
              icon={<ArrowLeft size={18} strokeWidth={2} aria-hidden />}
            >
              Back to Start
            </Button>
            <Button type="submit" disabled={saveDisabled}>
              Save
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
