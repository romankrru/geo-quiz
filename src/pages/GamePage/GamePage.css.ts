import { style } from '@vanilla-extract/css'
import { vars } from '@shared/theme'

export const progressSection = style({
  maxWidth: 720,
  margin: '0 auto',
})

export const progressHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
  color: vars.color.primary,
  fontWeight: 600,
})

export const questionCard = style({
  backgroundColor: vars.color.background,
  boxShadow: vars.shadows.primary,
  borderRadius: vars.radii.lg,
  margin: '20px auto',
  maxWidth: 720,
  padding: 48,
})

export const answerButtons = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
})

export const nextButton = style({
  display: 'block',
  marginTop: 16,
  marginLeft: 'auto',
  marginRight: 'auto',
})
