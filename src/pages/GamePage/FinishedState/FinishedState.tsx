import { Link } from '@tanstack/react-router'
import { Share } from 'lucide-react'
import Confetti from 'react-confetti-boom'
import toast from 'react-hot-toast'

import { quizService } from '@entities/quiz'
import { useCopyToClipboard } from '@shared/hooks'
import { cssColorToHex, themeLiterals } from '@shared/theme'
import { Button } from '@shared/ui'

import { HomeCorner } from '../HomeCorner/HomeCorner'

import * as styles from './FinishedState.css'

const confettiColors: string[] = [
  cssColorToHex(themeLiterals.color.primary),
  cssColorToHex(themeLiterals.color.success),
  cssColorToHex(themeLiterals.color.amber),
  cssColorToHex(themeLiterals.color.error),
]

type Props = {
  score: number
  totalQuestions: number
  timeLabel: string
  durationMs: number
  onPlayAgain: () => void
}

export const FinishedState = (props: Props) => {
  const copy = useCopyToClipboard()

  const handleShare = async () => {
    const text = quizService.formatShareText({
      score: props.score,
      totalQuestions: props.totalQuestions,
      durationMs: props.durationMs,
    })
    const ok = await copy(text)
    if (ok) {
      toast.success('Copied to clipboard')
    } else {
      toast.error("Couldn't copy")
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.title}>Game Over!</h2>
          <p className={styles.paragraph}>
            Score: {props.score} / {props.totalQuestions}
          </p>
          <p className={styles.paragraph}>Time: {props.timeLabel}</p>
          <div className={styles.actions}>
            <Button onClick={props.onPlayAgain}>Play Again</Button>
            <Button as={Link} to="/stats" variant="transparent">
              View Statistics
            </Button>
            <Button
              variant="transparent"
              icon={<Share size={18} strokeWidth={2} aria-hidden />}
              iconPosition="start"
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
          <div className={styles.confettiLayer} aria-hidden>
            <Confetti
              mode="boom"
              x={0.5}
              y={0.35}
              particleCount={400}
              spreadDeg={70}
              effectInterval={2600}
              effectCount={1}
              colors={confettiColors}
              launchSpeed={1.05}
            />
          </div>
        </div>
        <HomeCorner className={styles.homeCornerBelowCard} />
      </div>
    </div>
  )
}
