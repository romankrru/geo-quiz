import {
  type ComponentPropsWithoutRef,
  type ElementType,
  createElement,
} from 'react'
import { clsx } from 'clsx'
import * as style from './Buttons.css'

export type ButtonVariant = keyof typeof style.buttonAppearance

export type ButtonProps<E extends ElementType = 'button'> = {
  as?: E
  variant?: ButtonVariant
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'variant'>

export function Button<E extends ElementType = 'button'>(
  props: ButtonProps<E>,
) {
  const { as, className, variant = 'solid', ...rest } = props
  const Component = (as ?? 'button') as ElementType

  return createElement(Component, {
    ...rest,
    className: clsx(
      style.buttonBase,
      style.buttonAppearance[variant],
      className,
    ),
  })
}
