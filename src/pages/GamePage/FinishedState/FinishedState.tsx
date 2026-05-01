import Confetti from 'react-confetti-boom'
import { Button } from '@shared/ui'
import { cssColorToHex, themeLiterals } from '@shared/theme'
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
  onPlayAgain: () => void
}

export function FinishedState(props: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.title}>Game Over!</h2>
          <p className={styles.paragraph}>
            Score: {props.score} / {props.totalQuestions}
          </p>
          <p className={styles.paragraph}>Time: {props.timeLabel}</p>
          <Button onClick={props.onPlayAgain}>Play Again</Button>
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
      </div>
    </div>
  )
}
