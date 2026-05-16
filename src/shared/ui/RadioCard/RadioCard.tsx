import { clsx } from 'clsx'
import { type ChangeEvent, type ComponentProps, useId } from 'react'

import * as styles from './RadioCard.css'

type Props = {
  name: string
  value: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  headline: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  footer?: React.ReactNode
  disabled?: boolean
} & Pick<ComponentProps<'label'>, 'className'>

export const RadioCard = (props: Props) => {
  const reactId = useId()
  const radioId = `radio-card-${reactId}`

  return (
    <label
      className={clsx(
        styles.root,
        props.checked && styles.rootSelected,
        props.className,
      )}
    >
      <input
        id={radioId}
        className={styles.nativeInput}
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onChange}
      />
      <div className={styles.upper}>
        <span className={styles.indicatorRow}>
          <span
            className={clsx(
              styles.indicator,
              props.checked && styles.indicatorSelected,
            )}
            aria-hidden
          >
            <span
              className={clsx(
                styles.indicatorDot,
                props.checked && styles.indicatorDotFilled,
              )}
            />
          </span>
        </span>
        <span className={styles.headline}>{props.headline}</span>
        <span className={styles.title}>{props.title}</span>
        {props.subtitle !== undefined && props.subtitle !== null ? (
          <span className={styles.subtitle}>{props.subtitle}</span>
        ) : null}
      </div>
      {props.footer !== undefined ? (
        <div className={styles.footer}>{props.footer}</div>
      ) : null}
    </label>
  )
}
