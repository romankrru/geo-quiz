import { clsx } from 'clsx'

import * as styles from './ButtonQuiz.css'

export type ButtonQuizVariant = 'default' | 'success' | 'error'

type Props = {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
  variant: ButtonQuizVariant
  count: number
}

export const ButtonQuiz = (props: Props) => {
  const buttonClassName = clsx(styles.button, {
    [styles.buttonSuccess]: props.variant === 'success',
    [styles.buttonError]: props.variant === 'error',
  })

  const countClassName = clsx(styles.count, {
    [styles.countSuccess]: props.variant === 'success',
    [styles.countError]: props.variant === 'error',
  })

  return (
    <button
      className={buttonClassName}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <span className={countClassName}>{props.count}</span>
      {props.children}
    </button>
  )
}
