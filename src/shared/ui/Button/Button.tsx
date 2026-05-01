import { clsx } from 'clsx'
import {
  type ComponentPropsWithoutRef,
  createElement,
  type ElementType,
  type ReactNode,
} from 'react'

import * as style from './Buttons.css'

export type ButtonVariant = keyof typeof style.buttonAppearance

export type ButtonProps<E extends ElementType = 'button'> = {
  as?: E
  variant?: ButtonVariant
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
} & Omit<
  ComponentPropsWithoutRef<E>,
  'as' | 'variant' | 'icon' | 'iconPosition'
>

export function Button<E extends ElementType = 'button'>(
  props: ButtonProps<E>,
) {
  const {
    as,
    className,
    variant = 'solid',
    icon,
    iconPosition = 'start',
    children,
    ...rest
  } = props
  const Component = (as ?? 'button') as ElementType

  const content =
    icon == null ? (
      children
    ) : (
      <>
        {iconPosition === 'start' && (
          <span className={style.iconSlot}>{icon}</span>
        )}
        {children}
        {iconPosition === 'end' && (
          <span className={style.iconSlot}>{icon}</span>
        )}
      </>
    )

  return createElement(Component, {
    ...rest,
    className: clsx(
      style.buttonBase,
      style.buttonAppearance[variant],
      className,
    ),
    children: content,
  })
}
