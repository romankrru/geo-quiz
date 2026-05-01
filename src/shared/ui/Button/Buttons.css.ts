import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@shared/theme'

export const buttonBase = style({
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
})

export const buttonAppearance = styleVariants({
  solid: {
    backgroundColor: vars.color.primary,
    color: vars.color.background,
    padding: '16px 32px',
    borderRadius: vars.radii.md,
    boxShadow: '0 10px 0 rgb(0, 28, 55) ',
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
    selectors: {
      '&:not(:disabled):active': {
        transform: 'translateY(4px)',
        boxShadow: '0 5px 0 rgb(0, 28, 55) ',
      },
    },
  },
  transparent: {
    backgroundColor: 'transparent',
    color: vars.color.primary,
    padding: '8px 12px',
    borderRadius: vars.radii.sm,
    boxShadow: 'none',
    transition: 'background-color 0.12s ease, color 0.12s ease',
    selectors: {
      '&:not(:disabled):hover': {
        backgroundColor: vars.color.secondaryHover,
      },
      '&:not(:disabled):active': {
        backgroundColor: vars.color.secondary,
      },
    },
  },
})
