import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from './Button'

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Button',
    type: 'button' as const,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const LongLabel: Story = {
  args: {
    children: 'Start geography quiz',
  },
}

export const Submit: Story = {
  args: {
    type: 'submit',
    children: 'Submit answer',
  },
}

export const Transparent: Story = {
  args: {
    variant: 'transparent',
    children: '← Back to Start',
  },
}

/** Polymorphic `as` — e.g. `as={Link}` from TanStack Router */
export const AsAnchor: Story = {
  render: () => (
    <Button as="a" href="#polymorphic-demo" variant="solid">
      Open (demo anchor)
    </Button>
  ),
}
