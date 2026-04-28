import { style } from '@vanilla-extract/css'
import { vars } from '@shared/theme'

const hoverAccent = 'rgb(15 76 129 / 0.3)'

export const button = style({
  backgroundColor: vars.color.background,
  padding: '15px 20px',
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: vars.color.secondary,
  borderRadius: vars.radii.md,
  cursor: 'pointer',
  transition:
    'background-color 0.2s ease, border-color 0.2s ease, transform 0.12s ease',
  textAlign: 'left',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  gap: 10,
  selectors: {
    '&:disabled': {
      cursor: 'default',
      color: vars.color.text,
    },
    '&:not(:disabled):hover': {
      backgroundColor: vars.color.secondaryHover,
      borderColor: hoverAccent,
    },
    '&:not(:disabled):active': {
      transform: 'translateY(4px)',
    },
  },
})

export const buttonSuccess = style({
  backgroundColor: vars.color.successSoft,
  borderColor: vars.color.success,
  selectors: {
    '&:not(:disabled):hover': {
      backgroundColor: vars.color.successSoft,
      borderColor: vars.color.success,
    },
  },
})

export const buttonError = style({
  backgroundColor: vars.color.errorSoft,
  borderColor: vars.color.error,
  selectors: {
    '&:not(:disabled):hover': {
      backgroundColor: vars.color.errorSoft,
      borderColor: vars.color.error,
    },
  },
})

export const count = style({
  backgroundColor: vars.color.secondary,
  fontWeight: 600,
  borderRadius: '50%',
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease',
  selectors: {
    [`${button}:not(:disabled):hover &`]: {
      backgroundColor: hoverAccent,
    },
  },
})

export const countSuccess = style({
  backgroundColor: vars.color.success,
  color: vars.color.background,
  selectors: {
    [`${buttonSuccess}:not(:disabled):hover &`]: {
      backgroundColor: vars.color.success,
    },
  },
})

export const countError = style({
  backgroundColor: vars.color.error,
  color: vars.color.background,
  selectors: {
    [`${buttonError}:not(:disabled):hover &`]: {
      backgroundColor: vars.color.error,
    },
  },
})
