import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

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
