import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

export const root = style({
  minHeight: '100dvh',
  boxSizing: 'border-box',
  padding: 'clamp(1rem, 4vw, 2rem)',
  backgroundColor: vars.color.secondary,
  display: 'flex',
  justifyContent: 'center',
})

export const main = style({
  width: '100%',
  maxWidth: '960px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'clamp(1.75rem, 4vw, 2.5rem)',
})

export const pageTitle = style({
  margin: 0,
  fontFamily: vars.fontFamily.heading,
  fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
  fontWeight: 800,
  color: vars.color.heading,
  textAlign: 'center',
})

export const grid = style({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 'clamp(0.75rem, 2vw, 1.25rem)',
  '@media': {
    '(min-width: 520px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(min-width: 840px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
})

export const card = style({
  backgroundColor: vars.color.background,
  borderRadius: vars.radii.md,
  boxShadow: vars.shadows.primary,
  padding: 'clamp(1.25rem, 3vw, 1.75rem)',
  minHeight: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: '0.5rem',
})

export const cardValue = style({
  fontFamily: vars.fontFamily.heading,
  fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
  fontWeight: 700,
  color: vars.color.heading,
  lineHeight: 1.2,
})

export const cardLabel = style({
  fontFamily: vars.fontFamily.sans,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: vars.color.text,
  lineHeight: 1.4,
})

export const cardHint = style({
  fontFamily: vars.fontFamily.sans,
  fontSize: '0.75rem',
  fontWeight: 400,
  color: vars.color.text,
  lineHeight: 1.35,
  margin: 0,
  maxWidth: '22rem',
  opacity: 0.88,
})
