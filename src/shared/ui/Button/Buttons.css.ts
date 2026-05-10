import { style, styleVariants } from '@vanilla-extract/css'
import { darken } from 'polished'

import { themeLiterals, vars } from '@shared/theme'

export const buttonBase = style({
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  textAlign: 'center',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
})

export const iconSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  lineHeight: 0,
})

export const buttonAppearance = styleVariants({
  solid: {
    backgroundColor: vars.color.primary,
    color: vars.color.background,
    padding: '16px 32px',
    borderRadius: vars.radii.md,
    boxShadow: '0 10px 0 rgb(0, 28, 55) ',
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
    selectors: {
      '&:not(:disabled):active': {
        transform: 'translateY(4px)',
        boxShadow: '0 5px 0 rgb(0, 28, 55) ',
      },
    },
  },
  danger: {
    backgroundColor: vars.color.error,
    color: vars.color.background,
    padding: '16px 32px',
    borderRadius: vars.radii.md,
    boxShadow: 'none',
    transition: 'background-color 0.12s ease, color 0.12s ease',
    selectors: {
      '&:not(:disabled):hover': {
        backgroundColor: darken(0.05, themeLiterals.color.error),
      },
      '&:not(:disabled):active': {
        backgroundColor: darken(0.1, themeLiterals.color.error),
      },
    },
  },
  transparent: {
    backgroundColor: 'transparent',
    color: vars.color.primary,
    padding: '12px 16px',
    borderRadius: vars.radii.sm,
    boxShadow: 'none',
    transition: 'background-color 0.12s ease, color 0.12s ease',
    selectors: {
      '&:not(:disabled):hover': {
        backgroundColor: vars.color.secondaryHover,
      },
      '&:not(:disabled):active': {
        backgroundColor: vars.color.secondary,
      },
    },
  },
})
