import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'

import { RadioCard } from './RadioCard'

const meta = {
  title: 'shared/ui/RadioCard',
  component: RadioCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: 280, maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    name: 'radio-card-demo',
    value: 'option-a',
    checked: true,
    headline: '15',
    title: 'Countries completed',
    onChange: fn(),
  },
} satisfies Meta<typeof RadioCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Unchecked: Story = {
  args: {
    checked: false,
  },
}

export const WithSubtitle: Story = {
  args: {
    headline: 'Normal',
    title: 'Balanced difficulty',
    subtitle: 'Timer on, limited hints',
    checked: true,
  },
}

export const WithFooter: Story = {
  args: {
    headline: 'Hard',
    title: 'Strict mode',
    subtitle: 'No hints, shorter timer',
    checked: true,
    footer: (
      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>7 / 10</span>
    ),
  },
}

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    headline: 'Locked',
    title: 'Complete previous level first',
    subtitle: 'Unavailable until you finish Easy',
  },
}

const RadioGroupDemo = () => {
  const [value, setValue] = useState('easy')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <RadioCard
        name="difficulty"
        value="easy"
        checked={value === 'easy'}
        headline="Easy"
        title="Hints on, no timer"
        subtitle="Good for learning capitals"
        onChange={(event) => setValue(event.target.value)}
        footer={
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Done</span>
        }
      />
      <RadioCard
        name="difficulty"
        value="normal"
        checked={value === 'normal'}
        headline="Normal"
        title="Timer on, limited hints"
        subtitle="Default quiz experience"
        onChange={(event) => setValue(event.target.value)}
        footer={
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>4 / 10</span>
        }
      />
      <RadioCard
        name="difficulty"
        value="hard"
        checked={value === 'hard'}
        headline="Hard"
        title="Strict mode"
        subtitle="No hints, shorter timer"
        onChange={(event) => setValue(event.target.value)}
        footer={
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>0 / 10</span>
        }
      />
    </div>
  )
}

export const RadioGroup: Story = {
  name: 'Radio group (interactive)',
  render: () => <RadioGroupDemo />,
}
