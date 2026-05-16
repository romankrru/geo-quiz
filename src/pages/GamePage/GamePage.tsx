import { Clock } from 'lucide-react'
import { useMemo, useState } from 'react'

import { COUNTRIES } from '@entities/country/model/country.data'
import { quizService } from '@entities/quiz'
import { settingsService, SfxToggleButton } from '@entities/settings'
import { useKeyPress, useSfx } from '@shared/hooks'
import { Button, ProgressBar } from '@shared/ui'
import {
  ButtonQuiz,
  type ButtonQuizVariant,
} from '@shared/ui/ButtonQuiz/ButtonQuiz'

import failSoundUrl from '../../assets/fail.wav?url'
import successSoundUrl from '../../assets/success.wav?url'

import { FinishedState } from './FinishedState/FinishedState'
import { HomeCorner } from './HomeCorner/HomeCorner'
import { useQuizRound } from './hooks/useQuizRound'

import * as styles from './GamePage.css'
import * as homeCornerStyles from './HomeCorner/HomeCorner.css'

export function GamePage() {
  const round = useQuizRound(COUNTRIES)
  const [sfxEnabled, setSfxEnabled] = useState(
    () => settingsService.read().sfxEnabled,
  )

  const playSuccess = useSfx(successSoundUrl)
  const playFail = useSfx(failSoundUrl)

  const handleSelectAnswer = (answer: string) => {
    const { correct } = round.selectAnswer(answer)
    if (sfxEnabled) {
      ;(correct ? playSuccess : playFail)()
    }
  }

  const handlePlayAgain = () => {
    setSfxEnabled(settingsService.read().sfxEnabled)
    round.playAgain()
  }

  useKeyPress(
    ['1', '2', '3', '4'],
    (e) => {
      const idx = Number(e.key) - 1
      const option = round.questions[round.currentQuestionIndex]?.options[idx]
      if (option) handleSelectAnswer(option)
    },
    { enabled: round.status === 'playing' && round.selectedAnswer === null },
  )

  const canPressNext = useMemo(() => {
    if (round.status !== 'playing' || round.selectedAnswer === null) {
      return false
    }
    return round.currentQuestionIndex < round.questions.length - 1
  }, [
    round.status,
    round.selectedAnswer,
    round.currentQuestionIndex,
    round.questions.length,
  ])

  useKeyPress([' '], round.next, { enabled: canPressNext })

  if (round.status === 'finished') {
    return (
      <FinishedState
        score={round.score}
        totalQuestions={round.questions.length}
        timeLabel={quizService.formatRoundDuration(round.elapsedMs)}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  const question = round.questions[round.currentQuestionIndex]
  const answeredQuestionsCount =
    round.currentQuestionIndex + (round.selectedAnswer !== null ? 1 : 0)

  const handleToggleSfx = () => {
    setSfxEnabled((prev) => {
      const next = !prev
      const prefs = settingsService.read()
      settingsService.write({ ...prefs, sfxEnabled: next })
      return next
    })
  }

  const getOptionVariant = (option: string): ButtonQuizVariant => {
    if (round.selectedAnswer === null) {
      return 'default'
    }

    if (quizService.isCorrectAnswer(question, option)) {
      return 'success'
    }

    if (option === round.selectedAnswer) {
      return 'error'
    }

    return 'default'
  }

  return (
    <div className={styles.container}>
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>
            Progress: {answeredQuestionsCount} / {round.questions.length}
          </span>
          <span>Score: {round.score}</span>
          <div className={styles.progressHeaderRight}>
            <SfxToggleButton
              sfxEnabled={sfxEnabled}
              onClick={handleToggleSfx}
            />
            <div className={styles.timer}>
              <Clock className={styles.timerIcon} strokeWidth={3} size={20} />
              {quizService.formatRoundDuration(round.elapsedMs)}
            </div>
          </div>
        </div>
        <ProgressBar
          value={answeredQuestionsCount}
          max={round.questions.length}
        />
      </div>
      <div className={styles.questionCard}>
        <h2 className={styles.title}>
          Which country does this flag belong to?
        </h2>
        <div style={{ fontSize: '10rem', textAlign: 'center' }}>
          {question.flagEmoji}
        </div>
        <div className={styles.answerButtons}>
          {question.options.map((option, index) => (
            <ButtonQuiz
              count={index + 1}
              key={option}
              onClick={() => handleSelectAnswer(option)}
              disabled={round.selectedAnswer !== null}
              variant={getOptionVariant(option)}
            >
              {option}
            </ButtonQuiz>
          ))}
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarLeft}>
          <HomeCorner className={homeCornerStyles.inBottomBar} />
        </div>
        <div className={styles.bottomBarCenter}>
          {round.selectedAnswer !== null &&
            round.currentQuestionIndex < round.questions.length - 1 && (
              <>
                <Button onClick={round.next} className={styles.nextButton}>
                  Next
                </Button>
                <span className={styles.nextHint}>or press Space</span>
              </>
            )}
        </div>
        <div className={styles.bottomBarRight} aria-hidden />
      </div>
    </div>
  )
}
