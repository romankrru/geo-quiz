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
  maxWidth: '32rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 'clamp(1.25rem, 3vw, 1.75rem)',
})

export const pageTitle = style({
  margin: 0,
  fontFamily: vars.fontFamily.heading,
  fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
  fontWeight: 800,
  color: vars.color.heading,
  textAlign: 'center',
})

export const topActions = style({
  display: 'flex',
  justifyContent: 'center',
})

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
})

export const fieldset = style({
  margin: 0,
  padding: 'clamp(1rem, 3vw, 1.25rem)',
  border: `1px solid ${vars.color.secondaryHover}`,
  borderRadius: vars.radii.md,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadows.primary,
})

export const legend = style({
  fontFamily: vars.fontFamily.sans,
  fontSize: '1rem',
  fontWeight: 600,
  color: vars.color.heading,
  padding: '0 0.35rem',
})

export const radioStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '0.75rem',
})

export const radioLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontFamily: vars.fontFamily.sans,
  fontSize: '0.9375rem',
  color: vars.color.text,
  cursor: 'pointer',
})

export const customRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap',
})

export const numberInput = style({
  fontFamily: vars.fontFamily.sans,
  fontSize: '0.9375rem',
  padding: '0.35rem 0.5rem',
  borderRadius: vars.radii.sm,
  border: `1px solid ${vars.color.text}`,
  minWidth: '5rem',
  maxWidth: '8rem',
})

export const numberInputInvalid = style({
  borderColor: vars.color.error,
  outlineColor: vars.color.error,
})

export const saveRow = style({
  display: 'flex',
  justifyContent: 'center',
})
