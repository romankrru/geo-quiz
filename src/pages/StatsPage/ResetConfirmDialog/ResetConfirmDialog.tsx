import { useId } from 'react'

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
          Reset Statistics
        </h2>
        <p id={bodyId} className={styles.body}>
          This permanently clears your statistics on this device and can't be
          undone. It only affects this device.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={props.onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={props.onConfirm}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
