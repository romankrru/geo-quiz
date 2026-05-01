import { createGlobalTheme } from '@vanilla-extract/css'
import { lighten } from 'polished'

const systemSans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const fontStack = (name: string) => `'${name}', ${systemSans}`

const fontFamilyNames = {
  sans: 'Plus Jakarta Sans',
  heading: 'Lexend',
} as const

export const themeLiterals = {
  fontFamily: {
    sans: fontStack(fontFamilyNames.sans),
    heading: fontStack(fontFamilyNames.heading),
  },
  color: {
    text: 'rgb(66 71 79)',
    heading: 'rgb(25 28 29)',
    primary: 'rgb(0 53 95)',
    success: 'rgb(58 104 67)',
    successSoft: lighten(0.65, 'rgb(58 104 67)'),
    secondary: 'rgb(231, 232, 233)',
    secondaryHover: lighten(0.05, 'rgb(231, 232, 233)'),
    error: 'rgb(186 26 26)',
    errorSoft: lighten(0.52, 'rgb(186 26 26)'),
    warning: 'rgb(95 70 0)',
    amber: 'rgb(227 179 60)',
    background: 'rgb(255 255 255)',
  },
  radii: {
    lg: '32px',
    md: '16px',
    sm: '8px',
    xs: '4px',
  },
  shadows: {
    primary: 'rgba(15, 76, 129, 0.08) 0 15px 40px',
  },
}

export const vars = createGlobalTheme(':root', themeLiterals)
