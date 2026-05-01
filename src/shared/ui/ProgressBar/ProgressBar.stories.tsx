import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'shared/ui/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: 3,
    max: 10,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    value: 0,
    max: 10,
  },
}

export const Half: Story = {
  args: {
    value: 5,
    max: 10,
  },
}

export const Full: Story = {
  args: {
    value: 10,
    max: 10,
  },
}

export const SingleQuestion: Story = {
  name: 'Single step (1 of 1)',
  args: {
    value: 1,
    max: 1,
  },
}

export const ValueClampedToMax: Story = {
  name: 'Value clamped above max',
  args: {
    value: 12,
    max: 10,
  },
}

export const NarrowWidth: Story = {
  name: 'Narrow container',
  args: {
    value: 4,
    max: 10,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 120 }}>
        <Story />
      </div>
    ),
  ],
}
