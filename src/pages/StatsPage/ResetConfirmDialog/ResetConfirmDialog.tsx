import { useId } from 'react'

import { statsPageStrings } from '../StatsPage.strings'

import * as styles from './ResetConfirmDialog.css'

type Props = {
  onConfirm: () => void
  onCancel: () => void
}

export const ResetConfirmDialog = (props: Props) => {
  const titleId = useId()
  const bodyId = useId()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className={styles.backdrop}
    >
      <div className={styles.dialog}>
        <h2 id={titleId} className={styles.title}>
          {statsPageStrings.resetDialog.title}
        </h2>
        <p id={bodyId} className={styles.body}>
          {statsPageStrings.resetDialog.body}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={props.onCancel}
          >
            {statsPageStrings.resetDialog.cancel}
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={props.onConfirm}
          >
            {statsPageStrings.resetDialog.confirm}
          </button>
        </div>
      </div>
    </div>
  )
}
