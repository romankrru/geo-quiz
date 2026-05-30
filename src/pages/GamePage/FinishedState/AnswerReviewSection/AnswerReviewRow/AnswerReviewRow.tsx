import type { RoundAnswerReviewEntry } from '@entities/quiz'

import * as styles from './AnswerReviewRow.css'

type Props = {
  entry: RoundAnswerReviewEntry
}

export const AnswerReviewRow = (props: Props) => {
  return (
    <tr className={styles.row}>
      <td className={styles.numberCell}>{props.entry.questionNumber}</td>
      <td className={styles.flagCell}>{props.entry.flagEmoji}</td>
      <td className={styles.correctAnswerCell}>{props.entry.correctAnswer}</td>
      <td className={styles.yourAnswerCell}>
        {props.entry.isCorrect ? (
          <>
            <span aria-hidden="true" className={styles.correctMark}>
              ✓
            </span>
            <span className={styles.srOnly}>Correct</span>
          </>
        ) : (
          <span className={styles.selectedWrong}>
            {props.entry.selectedAnswer}
          </span>
        )}
      </td>
    </tr>
  )
}
