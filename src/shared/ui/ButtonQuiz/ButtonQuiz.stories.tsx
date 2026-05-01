import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ButtonQuiz } from './ButtonQuiz'

const meta = {
  title: 'shared/ui/ButtonQuiz',
  component: ButtonQuiz,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'France',
    count: 1,
    variant: 'default' as const,
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof ButtonQuiz>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Success: Story = {
  args: {
    variant: 'success',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledAfterAnswer: Story = {
  name: 'Disabled (after answer)',
  args: {
    disabled: true,
    variant: 'success',
    children: 'Germany',
    count: 2,
  },
}

export const LongLabel: Story = {
  args: {
    children: 'The United Kingdom of Great Britain and Northern Ireland',
  },
}

export const HighCount: Story = {
  args: {
    count: 10,
    children: 'Option J',
  },
}

export const AnswerRow: Story = {
  name: 'Three options (game-like)',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minWidth: 280,
        maxWidth: 360,
      }}
    >
      <ButtonQuiz
        count={1}
        variant="default"
        disabled={false}
        onClick={fn()}
      >
        France
      </ButtonQuiz>
      <ButtonQuiz
        count={2}
        variant="success"
        disabled
        onClick={fn()}
      >
        Germany
      </ButtonQuiz>
      <ButtonQuiz count={3} variant="error" disabled onClick={fn()}>
        Spain
      </ButtonQuiz>
    </div>
  ),
}
