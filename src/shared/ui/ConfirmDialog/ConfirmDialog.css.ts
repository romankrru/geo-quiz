import { style, styleVariants } from '@vanilla-extract/css'
import { darken } from 'polished'

import { themeLiterals, vars } from '@shared/theme'

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  zIndex: 1000,
})

export const dialog = style({
  backgroundColor: vars.color.background,
  borderRadius: vars.radii.md,
  boxShadow: vars.shadows.primary,
  padding: 'clamp(1.25rem, 3vw, 1.75rem)',
  maxWidth: '28rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

export const title = style({
  margin: 0,
  fontFamily: vars.fontFamily.heading,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: vars.color.heading,
})

export const body = style({
  margin: 0,
  fontFamily: vars.fontFamily.sans,
  fontSize: '0.95rem',
  lineHeight: 1.5,
  color: vars.color.text,
})

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '0.5rem',
})

export const cancelButton = style({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontFamily: vars.fontFamily.sans,
  fontWeight: 600,
  color: vars.color.primary,
  padding: '10px 16px',
  borderRadius: vars.radii.sm,
  transition: 'background-color 0.12s ease',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.secondaryHover,
    },
  },
})

const confirmButtonBase = style({
  border: 'none',
  cursor: 'pointer',
  fontFamily: vars.fontFamily.sans,
  fontWeight: 700,
  color: vars.color.background,
  padding: '10px 20px',
  borderRadius: vars.radii.sm,
  transition: 'background-color 0.12s ease',
})

export const confirmButtonAppearance = styleVariants({
  primary: [
    confirmButtonBase,
    {
      backgroundColor: vars.color.primary,
      selectors: {
        '&:hover': {
          backgroundColor: darken(0.05, themeLiterals.color.primary),
        },
      },
    },
  ],
  destructive: [
    confirmButtonBase,
    {
      backgroundColor: vars.color.error,
      selectors: {
        '&:hover': {
          backgroundColor: darken(0.05, themeLiterals.color.error),
        },
      },
    },
  ],
})
