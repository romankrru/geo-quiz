import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

import './vars.css.ts'
import { themeLiterals, vars } from './vars.css'

const tableStyle: CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  maxWidth: 880,
}

const cellStyle: CSSProperties = {
  padding: '10px 12px',
  borderBottom: `1px solid ${vars.color.secondary}`,
  verticalAlign: 'middle',
}

const monoStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
  fontSize: 13,
}

const valueCellStyle: CSSProperties = {
  ...monoStyle,
  wordBreak: 'break-word',
  maxWidth: 420,
}

const sectionTitleStyle: CSSProperties = {
  fontFamily: vars.fontFamily.heading,
  fontSize: 20,
  marginTop: 28,
  marginBottom: 12,
  color: vars.color.heading,
}

function formatRadiusLiteral(px: string): string {
  const n = Number.parseInt(px, 10)
  if (!Number.isFinite(n) || !px.endsWith('px')) {
    return px
  }
  return `${px} (${n})`
}

function ThemeTokensReference() {
  const colorKeys = Object.keys(
    themeLiterals.color,
  ) as (keyof typeof themeLiterals.color)[]
  const radiiKeys = Object.keys(
    themeLiterals.radii,
  ) as (keyof typeof themeLiterals.radii)[]
  const shadowKeys = Object.keys(
    themeLiterals.shadows,
  ) as (keyof typeof themeLiterals.shadows)[]
  const fontKeys = Object.keys(
    themeLiterals.fontFamily,
  ) as (keyof typeof themeLiterals.fontFamily)[]

  return (
    <div style={{ color: vars.color.text, fontFamily: vars.fontFamily.sans }}>
      <h1
        style={{
          fontFamily: vars.fontFamily.heading,
          fontSize: 28,
          marginBottom: 8,
          color: vars.color.heading,
        }}
      >
        Theme tokens
      </h1>
      <p style={{ marginTop: 0, marginBottom: 24, maxWidth: 560 }}>
        <strong>Value</strong> shows literals from{' '}
        <code style={monoStyle}>themeLiterals</code> (the object passed to{' '}
        <code style={monoStyle}>createGlobalTheme</code>
        ). Previews use <code style={monoStyle}>vars</code> (CSS variables).
      </p>

      <h2 style={sectionTitleStyle}>color</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Value</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {colorKeys.map((key) => (
            <tr key={key}>
              <td style={cellStyle}>
                <code style={monoStyle}>{`color.${String(key)}`}</code>
              </td>
              <td style={{ ...cellStyle, ...valueCellStyle }}>
                {themeLiterals.color[key]}
              </td>
              <td style={cellStyle}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: vars.radii.sm,
                    backgroundColor: vars.color[key],
                    border: `1px solid ${vars.color.secondary}`,
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={sectionTitleStyle}>fontFamily</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Value</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Sample</th>
          </tr>
        </thead>
        <tbody>
          {fontKeys.map((key) => (
            <tr key={key}>
              <td style={cellStyle}>
                <code style={monoStyle}>{`fontFamily.${String(key)}`}</code>
              </td>
              <td style={{ ...cellStyle, ...valueCellStyle }}>
                {themeLiterals.fontFamily[key]}
              </td>
              <td
                style={{
                  ...cellStyle,
                  fontFamily: vars.fontFamily[key],
                  fontSize: 18,
                }}
              >
                Geography quiz — Аа Бб 123
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={sectionTitleStyle}>radii</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Value</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {radiiKeys.map((key) => (
            <tr key={key}>
              <td style={cellStyle}>
                <code style={monoStyle}>{`radii.${String(key)}`}</code>
              </td>
              <td style={{ ...cellStyle, ...valueCellStyle }}>
                {formatRadiusLiteral(themeLiterals.radii[key])}
              </td>
              <td style={cellStyle}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: vars.color.secondary,
                    borderRadius: vars.radii[key],
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={sectionTitleStyle}>shadows</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Value</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {shadowKeys.map((key) => (
            <tr key={key}>
              <td style={cellStyle}>
                <code style={monoStyle}>{`shadows.${String(key)}`}</code>
              </td>
              <td style={{ ...cellStyle, ...valueCellStyle }}>
                {themeLiterals.shadows[key]}
              </td>
              <td style={cellStyle}>
                <div
                  style={{
                    width: 120,
                    height: 72,
                    borderRadius: vars.radii.md,
                    backgroundColor: vars.color.background,
                    boxShadow: vars.shadows[key],
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const meta = {
  title: 'shared/theme/vars',
  component: ThemeTokensReference,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeTokensReference>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ThemeTokensReference />,
}
