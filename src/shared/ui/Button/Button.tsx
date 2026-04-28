import { type ComponentProps } from 'react'
import { clsx } from 'clsx'
import * as style from './Buttons.css'

type ButtonProps = ComponentProps<'button'>

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button {...props} className={clsx(style.button, className)} />
  )
}
