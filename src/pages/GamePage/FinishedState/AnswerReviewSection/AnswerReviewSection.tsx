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
      <ul className={styles.list}>
        {props.answerReview.map((entry) => (
          <AnswerReviewRow key={entry.questionNumber} entry={entry} />
        ))}
      </ul>
    </section>
  )
}
