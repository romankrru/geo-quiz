import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 0',
  borderBottom: `1px solid ${vars.color.secondary}`,
  ':last-child': {
    borderBottom: 'none',
  },
})

export const number = style({
  color: vars.color.text,
  minWidth: 28,
  flexShrink: 0,
  paddingTop: 2,
})

export const flag = style({
  fontSize: '1.5rem',
  lineHeight: 1,
  flexShrink: 0,
})

export const answers = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
})

export const correctAnswer = style({
  color: vars.color.success,
  fontWeight: 500,
})

export const selectedWrong = style({
  color: vars.color.error,
})

export const correctRight = style({
  color: vars.color.success,
})
