import { style } from '@vanilla-extract/css'
import { vars } from '@shared/theme'

export const container = style({
  margin: '20px',
})

export const title = style({
  marginBottom: 0,
})

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

export const nextSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 12,
})

export const nextButton = style({
  display: 'block',
})

export const nextHint = style({
  marginTop: 16,
  fontSize: 12,
  fontStyle: 'italic',
  color: vars.color.text,
  opacity: 0.65,
})

export const timer = style({
  fontVariantNumeric: 'tabular-nums',
  fontSize: 18,
  fontFamily: 'system-ui',
  fontWeight: 'bold',
  backgroundColor: vars.color.background,
  boxShadow: vars.shadows.primary,
  padding: '8px 16px',
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.secondary}`,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
})

export const timerIcon = style({
  color: vars.color.amber,
  flexShrink: 0,
})
