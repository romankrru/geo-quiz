import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

export const row = style({
  borderBottom: `1px solid ${vars.color.secondary}`,
  ':last-child': {
    borderBottom: 'none',
  },
})

const bodyCell = style({
  color: vars.color.text,
  padding: '10px 8px',
  verticalAlign: 'middle',
  wordBreak: 'break-word',
})

export const numberCell = style([
  bodyCell,
  {
    textAlign: 'center',
  },
])

export const flagCell = style([
  bodyCell,
  {
    fontSize: '2.5rem',
    lineHeight: 1,
    textAlign: 'center',
  },
])

export const correctAnswerCell = style([
  bodyCell,
  {
    color: vars.color.success,
    fontWeight: 500,
    textAlign: 'left',
  },
])

export const yourAnswerCell = style([
  bodyCell,
  {
    textAlign: 'left',
  },
])

export const correctMark = style({
  color: vars.color.success,
  fontWeight: 500,
})

export const selectedWrong = style({
  alignItems: 'center',
  color: vars.color.error,
  display: 'inline-flex',
  gap: 8,
})

export const selectedAnswerFlag = style({
  flexShrink: 0,
  fontSize: '1.5rem',
  lineHeight: 1,
})

export const srOnly = style({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
})
