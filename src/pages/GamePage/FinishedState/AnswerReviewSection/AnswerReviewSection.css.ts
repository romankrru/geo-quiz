import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

export const section = style({
  backgroundColor: vars.color.background,
  boxShadow: vars.shadows.primary,
  borderRadius: vars.radii.lg,
  margin: '20px auto',
  maxWidth: 720,
  padding: 48,
})

export const heading = style({
  color: vars.color.heading,
  marginBottom: 16,
})

export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
})
