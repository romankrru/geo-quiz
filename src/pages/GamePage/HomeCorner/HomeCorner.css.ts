import { style } from '@vanilla-extract/css'

export const afterCard = style({
  maxWidth: 720,
  margin: '16px auto 0',
  display: 'flex',
  justifyContent: 'flex-start',
})

export const cornerFixed = style({
  position: 'fixed',
  left: 20,
  bottom: 20,
  zIndex: 10,
})
