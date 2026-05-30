import type { RoundAnswerReviewEntry } from '@entities/quiz'

import * as styles from './AnswerReviewRow.css'

type Props = {
  entry: RoundAnswerReviewEntry
}

export const AnswerReviewRow = (props: Props) => {
  return (
    <li className={styles.row}>
      <span className={styles.number}>{props.entry.questionNumber}.</span>
      <span className={styles.flag}>{props.entry.flagEmoji}</span>
      <div className={styles.answers}>
        {props.entry.isCorrect ? (
          <span className={styles.correctAnswer}>
            {props.entry.correctAnswer}
          </span>
        ) : (
          <>
            <span className={styles.correctRight}>
              Correct: {props.entry.correctAnswer}
            </span>
            <span className={styles.selectedWrong}>
              Answer: {props.entry.selectedAnswer}
            </span>
          </>
        )}
      </div>
    </li>
  )
}
