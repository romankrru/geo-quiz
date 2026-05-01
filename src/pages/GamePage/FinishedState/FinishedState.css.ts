import { style } from '@vanilla-extract/css'
import { vars } from '@shared/theme'

export const root = style({
  // position: 'relative',
  minHeight: '100vh',
  width: '100%',
})

export const confettiLayer = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
})

export const content = style({
  position: 'relative',
  zIndex: 2,
})

export const card = style({
  backgroundColor: vars.color.background,
  boxShadow: vars.shadows.primary,
  borderRadius: vars.radii.lg,
  margin: '20px auto',
  maxWidth: 720,
  padding: 48,
})

export const title = style({
  color: vars.color.heading,
})

export const paragraph = style({
  color: vars.color.text,
})
