import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

export const message = style({
  fontFamily: vars.fontFamily.sans,
  lineHeight: 1.6,
  color: '#4a5568',
  margin: 0,
  maxWidth: '32rem',
  textAlign: 'center',
})
