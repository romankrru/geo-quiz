import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

const cardSurface = 'rgb(240 244 248)'
const borderMuted = 'rgb(208 213 221)'

export const root = style({
  position: 'relative',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '0.75rem',
  padding: '1rem',
  borderRadius: vars.radii.md,
  backgroundColor: cardSurface,
  border: `1px solid ${borderMuted}`,
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  selectors: {
    '&:has(input:disabled)': {
      cursor: 'not-allowed',
      opacity: 0.55,
    },
    '&:has(input:focus-visible)': {
      boxShadow: `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.primary}`,
    },
  },
})

export const rootSelected = style({
  border: `3px solid ${vars.color.primary}`,
  boxShadow: vars.shadows.primary,
})

export const nativeInput = style({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})

export const upper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.35rem',
  cursor: 'pointer',
})

export const indicatorRow = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.15rem',
})

export const indicator = style({
  boxSizing: 'border-box',
  width: '1.125rem',
  height: '1.125rem',
  borderRadius: '50%',
  border: `2px solid ${borderMuted}`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

export const indicatorSelected = style({
  borderColor: vars.color.primary,
})

export const indicatorDot = style({
  width: '0.45rem',
  height: '0.45rem',
  borderRadius: '50%',
  backgroundColor: 'transparent',
})

export const indicatorDotFilled = style({
  backgroundColor: vars.color.primary,
})

export const headline = style({
  margin: 0,
  fontFamily: vars.fontFamily.heading,
  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
  fontWeight: 800,
  lineHeight: 1.1,
  color: vars.color.heading,
})

export const title = style({
  fontFamily: vars.fontFamily.sans,
  fontSize: '1rem',
  fontWeight: 700,
  color: vars.color.heading,
})

export const subtitle = style({
  fontFamily: vars.fontFamily.sans,
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: vars.color.text,
})

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  marginTop: 'auto',
  paddingTop: '0.25rem',
})
