import { clsx } from 'clsx'
import {
  type ChangeEvent,
  type ComponentProps,
  type MouseEvent,
  useId,
  useRef,
} from 'react'

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
} & Pick<ComponentProps<'div'>, 'className'>

export const RadioCard = (props: Props) => {
  const reactId = useId()
  const radioId = `radio-card-${reactId}`
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFooterClick = (event: MouseEvent<HTMLDivElement>) => {
    if (props.disabled) {
      return
    }
    if (
      (event.target as HTMLElement).closest(
        'input,textarea,select,button,a[href]',
      )
    ) {
      return
    }
    inputRef.current?.click()
  }

  return (
    <div
      className={clsx(
        styles.root,
        props.checked && styles.rootSelected,
        props.className,
      )}
    >
      <input
        ref={inputRef}
        id={radioId}
        className={styles.nativeInput}
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onChange}
      />
      <label htmlFor={radioId} className={styles.upper}>
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
      </label>
      {props.footer !== undefined ? (
        <div className={styles.footer} onClick={handleFooterClick}>
          {props.footer}
        </div>
      ) : null}
    </div>
  )
}

type FooterDotsProps = {
  totalDots: number
  filledDots: number
  caption: React.ReactNode
}

export const RadioCardFooterDots = (props: FooterDotsProps) => {
  const safeTotal = Math.max(1, props.totalDots)
  const filled = Math.min(Math.max(props.filledDots, 0), safeTotal)

  return (
    <div className={styles.footerDotsRow}>
      <div className={styles.dotsTrack}>
        {Array.from({ length: safeTotal }, (_, index) => (
          <span
            key={index}
            className={clsx(styles.dot, index < filled && styles.dotFilled)}
          />
        ))}
      </div>
      <span className={styles.footerCaption}>{props.caption}</span>
    </div>
  )
}
