import { style } from '@vanilla-extract/css'
import { vars } from '@shared/theme'

export const track = style({
  width: '100%',
  height: 16,
  borderRadius: vars.radii.md,
  backgroundColor: vars.color.secondary,
  overflow: 'hidden',
})

export const fill = style({
  height: '100%',
  borderRadius: vars.radii.md,
  backgroundColor: vars.color.success,
  transition: 'width 0.2s ease-in-out',
})
