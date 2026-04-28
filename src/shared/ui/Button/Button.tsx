import { type ComponentProps } from 'react'
import * as style from './Buttons.css'

type ButtonProps = ComponentProps<'button'>

export const Button = ({ className, ...props }: ButtonProps) => {
  return <button {...props} className={style.button} />
}
