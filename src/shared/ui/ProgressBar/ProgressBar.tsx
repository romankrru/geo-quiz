import { type ComponentProps } from 'react'
import { clsx } from 'clsx'
import * as styles from './ProgressBar.css'

type ProgressBarProps = {
  value: number
  max: number
} & Pick<ComponentProps<'div'>, 'className'>

export const ProgressBar = ({ value, max, className }: ProgressBarProps) => {
  const safeMax = max > 0 ? max : 1
  const clampedValue = Math.min(Math.max(value, 0), safeMax)
  const progressPercent = (clampedValue / safeMax) * 100

  return (
    <div
      className={clsx(styles.track, className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clampedValue}
    >
      <div className={styles.fill} style={{ width: `${progressPercent}%` }} />
    </div>
  )
}
