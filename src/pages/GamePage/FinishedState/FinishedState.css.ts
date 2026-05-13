import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

export const root = style({
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

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 16,
  marginTop: 8,
})

/** Wrapper for `HomeCorner` under the finished-game card (flow, not fixed). */
export const homeCornerBelowCard = style({
  maxWidth: 720,
  margin: '0 auto',
  padding: '0 20px',
  marginTop: 20,
  display: 'flex',
  justifyContent: 'center',
})
