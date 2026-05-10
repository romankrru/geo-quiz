import { type ReactNode, useId } from 'react'

import { Button } from '../Button/Button'

import * as styles from './ConfirmDialog.css'

export type ConfirmDialogVariant = 'primary' | 'destructive'

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
  const confirmButtonVariant =
    confirmVariant === 'destructive' ? 'danger' : 'solid'

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
          <Button type="button" variant="transparent" onClick={props.onCancel}>
            {props.cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmButtonVariant}
            onClick={props.onConfirm}
          >
            {props.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
