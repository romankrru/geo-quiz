import type { RoundAnswerReviewEntry } from '@entities/quiz'

import { AnswerReviewRow } from './AnswerReviewRow/AnswerReviewRow'

import * as styles from './AnswerReviewSection.css'

type Props = {
  answerReview: RoundAnswerReviewEntry[]
}

export const AnswerReviewSection = (props: Props) => {
  if (props.answerReview.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>Your answers</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.numberHeader} scope="col">
              №
            </th>
            <th
              className={styles.flagHeader}
              scope="col"
              aria-label="Flag"
            ></th>
            <th className={styles.answerHeader} scope="col">
              Correct answer
            </th>
            <th className={styles.answerHeader} scope="col">
              Your answer
            </th>
          </tr>
        </thead>
        <tbody>
          {props.answerReview.map((entry) => (
            <AnswerReviewRow key={entry.questionNumber} entry={entry} />
          ))}
        </tbody>
      </table>
    </section>
  )
}
