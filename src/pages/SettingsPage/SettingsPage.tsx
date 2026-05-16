import { Link } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { ArrowLeft } from 'lucide-react'
import { type ChangeEvent, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { COUNTRIES } from '@entities/country/model/country.data'
import { type RoundSelection, settingsService } from '@entities/settings'
import { Button } from '@shared/ui/Button/Button'
import { RadioCard } from '@shared/ui/RadioCard/RadioCard'

import * as styles from './SettingsPage.css'

const catalogSize = COUNTRIES.length

const ROUND_GROUP = 'configured-round-size'

export const SettingsPage = () => {
  const initial = useMemo(
    () => settingsService.persistedToSelection(settingsService.read().round),
    [],
  )
  const [selection, setSelection] = useState<RoundSelection>(initial.selection)
  const [customDigits, setCustomDigits] = useState(initial.customDigits)

  const customParsed = settingsService.parsePositiveIntegerDigits(customDigits)
  const customInvalid =
    selection === 'custom' &&
    (customParsed === null ||
      !settingsService.isValidCustomRoundSize(customParsed, catalogSize))

  const customSubtitle =
    customParsed !== null &&
    settingsService.isValidCustomRoundSize(customParsed, catalogSize)
      ? settingsService.formatApproxRoundMinutesLabel(customParsed)
      : 'your call'

  const saveDisabled = selection === 'custom' ? customInvalid : false

  const handleRoundChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    if (
      next === 'ten' ||
      next === 'twenty_five' ||
      next === 'all' ||
      next === 'custom'
    ) {
      setSelection(next)
    }
  }

  const handleSave = () => {
    const intent = settingsService.intentFromSelection(
      selection,
      customDigits,
      catalogSize,
    )
    const persisted = settingsService.read()
    if (!settingsService.configuredRoundSizesEqual(intent, persisted.round)) {
      settingsService.write({ ...persisted, round: intent })
      toast.success('Settings saved')
      return
    }
    toast('Already up to date')
  }

  const handleCustomBlur = () => {
    if (selection !== 'custom') {
      return
    }
    const parsed = settingsService.parsePositiveIntegerDigits(customDigits)
    if (parsed === null) {
      return
    }
    if (settingsService.isValidCustomRoundSize(parsed, catalogSize)) {
      return
    }
    setCustomDigits(
      String(settingsService.clampCustomRoundSize(parsed, catalogSize)),
    )
  }

  const customHeadline = customDigits.length > 0 ? customDigits : '\u2014'

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
              <p>
                How many countries are shown per game. Smaller rounds are
                friendlier for warm-ups; bigger ones are a real test of memory.
              </p>
            </span>
            <div className={styles.cardGrid}>
              <RadioCard
                className={styles.radioCard}
                name={ROUND_GROUP}
                value="ten"
                checked={selection === 'ten'}
                onChange={handleRoundChange}
                headline="10"
                title="Quick play"
                subtitle={settingsService.formatApproxRoundMinutesLabel(10)}
                footer={
                  <span className={styles.radioCardFooterCaption}>
                    {`10 / ${catalogSize}`}
                  </span>
                }
              />
              <RadioCard
                className={styles.radioCard}
                name={ROUND_GROUP}
                value="twenty_five"
                checked={selection === 'twenty_five'}
                onChange={handleRoundChange}
                headline="25"
                title="Classic"
                subtitle={settingsService.formatApproxRoundMinutesLabel(25)}
                footer={
                  <span className={styles.radioCardFooterCaption}>
                    {`25 / ${catalogSize}`}
                  </span>
                }
              />
              <RadioCard
                className={styles.radioCard}
                name={ROUND_GROUP}
                value="all"
                checked={selection === 'all'}
                onChange={handleRoundChange}
                headline={String(catalogSize)}
                title="Every country"
                subtitle={settingsService.formatApproxRoundMinutesLabel(
                  catalogSize,
                )}
                footer={
                  <span className={styles.radioCardFooterCaption}>
                    Full catalog
                  </span>
                }
              />
              <RadioCard
                className={styles.radioCard}
                name={ROUND_GROUP}
                value="custom"
                checked={selection === 'custom'}
                onChange={handleRoundChange}
                headline={customHeadline}
                title="Custom"
                subtitle={customSubtitle}
                footer={
                  <input
                    id="settings-custom-round-size"
                    className={clsx(
                      styles.numberInput,
                      selection !== 'custom' && styles.numberInputInactive,
                      customInvalid &&
                        selection === 'custom' &&
                        styles.numberInputInvalid,
                    )}
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
                }
              />
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
