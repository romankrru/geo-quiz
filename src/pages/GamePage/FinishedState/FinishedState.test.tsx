import { cleanup, render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { RoundAnswerReviewEntry } from '@entities/quiz'

import { FinishedState } from './FinishedState'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: (props: { to: string; children: ReactNode; className?: string }) => (
      <a href={props.to} className={props.className}>
        {props.children}
      </a>
    ),
  }
})

vi.mock('react-confetti-boom', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="confetti" data-active={String(props.active !== false)} />
  ),
}))

const BASE_PROPS = {
  score: 2,
  totalQuestions: 3,
  timeLabel: '0:45.2',
  durationMs: 45200,
  onPlayAgain: vi.fn(),
  answerReview: [] as RoundAnswerReviewEntry[],
}

const CORRECT_ENTRY: RoundAnswerReviewEntry = {
  questionNumber: 1,
  flagEmoji: '🇦🇦',
  correctAnswer: 'Aland',
  selectedAnswer: 'Aland',
  isCorrect: true,
}

const INCORRECT_ENTRY: RoundAnswerReviewEntry = {
  questionNumber: 2,
  flagEmoji: '🇧🇧',
  correctAnswer: 'Bland',
  selectedAnswer: 'Cland',
  isCorrect: false,
}

describe('FinishedState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the Your answers heading when answerReview is non-empty', () => {
    render(
      <FinishedState
        {...BASE_PROPS}
        answerReview={[CORRECT_ENTRY, INCORRECT_ENTRY]}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /your answers/i }),
    ).toBeInTheDocument()
  })

  it('does not render the Your answers heading when answerReview is empty', () => {
    render(<FinishedState {...BASE_PROPS} answerReview={[]} />)

    expect(
      screen.queryByRole('heading', { name: /your answers/i }),
    ).not.toBeInTheDocument()
  })

  it('renders question number for supplied entries', () => {
    render(
      <FinishedState
        {...BASE_PROPS}
        answerReview={[CORRECT_ENTRY, INCORRECT_ENTRY]}
      />,
    )

    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('2.')).toBeInTheDocument()
  })

  it('renders correct entry with country name once, no Answer / Correct labels', () => {
    render(<FinishedState {...BASE_PROPS} answerReview={[CORRECT_ENTRY]} />)

    expect(screen.getByText('Aland')).toBeInTheDocument()
    expect(screen.queryByText(/^answer:/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/^correct:/i)).not.toBeInTheDocument()
  })

  it('renders incorrect entry with Answer and Correct labels', () => {
    render(<FinishedState {...BASE_PROPS} answerReview={[INCORRECT_ENTRY]} />)

    expect(screen.getByText(/^answer:\s*Cland/i)).toBeInTheDocument()
    expect(screen.getByText(/^correct:\s*Bland/i)).toBeInTheDocument()
  })

  it('renders confetti when score equals totalQuestions', () => {
    render(
      <FinishedState
        {...BASE_PROPS}
        score={3}
        totalQuestions={3}
        answerReview={[CORRECT_ENTRY]}
      />,
    )

    const confetti = screen.getByTestId('confetti')
    expect(confetti).toBeInTheDocument()
    expect(confetti.dataset.active).toBe('true')
  })

  it('does not render confetti when score is less than totalQuestions', () => {
    render(
      <FinishedState
        {...BASE_PROPS}
        score={2}
        totalQuestions={3}
        answerReview={[CORRECT_ENTRY]}
      />,
    )

    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument()
  })

  it('renders the summary card above the review list', () => {
    render(
      <FinishedState
        {...BASE_PROPS}
        answerReview={[CORRECT_ENTRY, INCORRECT_ENTRY]}
      />,
    )

    const card = screen
      .getByRole('heading', { name: /game over/i })
      .closest('div')!
    const reviewSection = screen
      .getByRole('heading', { name: /your answers/i })
      .closest('section')!

    expect(card.compareDocumentPosition(reviewSection)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('renders all entries from the review list in order', () => {
    const entries: RoundAnswerReviewEntry[] = [
      CORRECT_ENTRY,
      INCORRECT_ENTRY,
      {
        questionNumber: 3,
        flagEmoji: '🇨🇨',
        correctAnswer: 'Cland',
        selectedAnswer: 'Cland',
        isCorrect: true,
      },
    ]

    render(<FinishedState {...BASE_PROPS} answerReview={entries} />)

    const rows = screen.getAllByRole('listitem')
    expect(rows).toHaveLength(3)
    expect(within(rows[0]).getByText('1.')).toBeInTheDocument()
    expect(within(rows[1]).getByText('2.')).toBeInTheDocument()
    expect(within(rows[2]).getByText('3.')).toBeInTheDocument()
  })
})
