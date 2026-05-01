import { type ComponentProps } from 'react'
import { clsx } from 'clsx'
import * as style from './Buttons.css'

export type ButtonVariant = keyof typeof style.buttonAppearance

type Props = ComponentProps<'button'> & {
  variant?: ButtonVariant
}

export const Button = (props: Props) => {
  const { className, variant = 'solid', ...rest } = props

  return (
    <button
      {...rest}
      className={clsx(
        style.buttonBase,
        style.buttonAppearance[variant],
        className,
      )}
    />
  )
}
