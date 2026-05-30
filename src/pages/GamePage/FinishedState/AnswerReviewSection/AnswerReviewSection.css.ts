import { style } from '@vanilla-extract/css'

import { vars } from '@shared/theme'

export const section = style({
  backgroundColor: vars.color.background,
  boxShadow: vars.shadows.primary,
  borderRadius: vars.radii.lg,
  margin: '20px auto',
  maxWidth: 720,
  padding: 48,
})

export const heading = style({
  color: vars.color.heading,
  marginBottom: 16,
})

export const table = style({
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  width: '100%',
})

const headerCell = style({
  color: vars.color.text,
  fontWeight: 600,
  padding: '0 8px 12px',
  textAlign: 'left',
  verticalAlign: 'bottom',
})

export const numberHeader = style([
  headerCell,
  {
    textAlign: 'center',
    width: '10%',
  },
])

export const flagHeader = style([
  headerCell,
  {
    textAlign: 'center',
    width: '15%',
  },
])

export const answerHeader = style([
  headerCell,
  {
    width: '37.5%',
  },
])
