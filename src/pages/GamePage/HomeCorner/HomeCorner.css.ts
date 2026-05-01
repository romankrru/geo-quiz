import { style } from '@vanilla-extract/css'

export const inBottomBar = style({
  display: 'flex',
  justifyContent: 'flex-start',
})

export const cornerFixed = style({
  position: 'fixed',
  left: 20,
  bottom: 20,
  zIndex: 10,
})
