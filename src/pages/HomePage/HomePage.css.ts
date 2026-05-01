import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

export const root = style({
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  backgroundColor: '#f0f4f8',
  boxSizing: 'border-box',
})

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  maxWidth: '32rem',
  gap: '1.25rem',
  transform: 'translateY(calc(-1 * clamp(1.5rem, 6vh, 4rem)))',
})

export const title = style({
  fontFamily: vars.fontFamily.heading,
  fontSize: 'clamp(2rem, 5vw, 2.75rem)',
  fontWeight: 800,
  color: '#1a202c',
  margin: 0,
  lineHeight: 1.15,
})

export const description = style({
  fontFamily: vars.fontFamily.sans,
  lineHeight: 1.6,
  color: '#4a5568',
  margin: 0,
})

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
})
