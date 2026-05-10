import { type ReactNode, useId } from 'react'

import * as styles from './ConfirmDialog.css'

export type ConfirmDialogVariant = keyof typeof styles.confirmButtonAppearance

type Props = {
  title: string
  body: ReactNode
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  confirmVariant?: ConfirmDialogVariant
}

export const ConfirmDialog = (props: Props) => {
  const titleId = useId()
  const bodyId = useId()
  const confirmVariant = props.confirmVariant ?? 'primary'

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
          {props.title}
        </h2>
        <p id={bodyId} className={styles.body}>
          {props.body}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={props.onCancel}
          >
            {props.cancelLabel}
          </button>
          <button
            type="button"
            className={styles.confirmButtonAppearance[confirmVariant]}
            onClick={props.onConfirm}
          >
            {props.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
