import { style } from '@vanilla-extract/css'
import { vars } from '@shared/theme'

export const button = style({
  backgroundColor: vars.color.primary,
  color: vars.color.background,
  padding: '16px 32px',
  border: 'none',
  borderRadius: vars.radii.md,
  cursor: 'pointer',
  boxShadow: '0 10px 0 rgb(0, 28, 55) ',
  fontWeight: 'bold',
  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
  selectors: {
    '&:not(:disabled):active': {
      transform: 'translateY(4px)',
      boxShadow: '0 5px 0 rgb(0, 28, 55) ',
    },
  },
})
