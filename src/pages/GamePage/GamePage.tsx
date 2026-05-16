import { Clock } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { COUNTRIES } from '@entities/country/model/country.data'
import { preferencesService, SfxToggleButton } from '@entities/preferences'
import { type QuizQuestion, quizService } from '@entities/quiz'
import { statisticsService } from '@entities/statistics'
import { useKeyPress, useSfx, useStopwatch } from '@shared/hooks'
import { Button, ProgressBar } from '@shared/ui'
import {
  ButtonQuiz,
  type ButtonQuizVariant,
} from '@shared/ui/ButtonQuiz/ButtonQuiz'

import failSoundUrl from '../../assets/fail.wav?url'
import successSoundUrl from '../../assets/success.wav?url'

import { FinishedState } from './FinishedState/FinishedState'
import { HomeCorner } from './HomeCorner/HomeCorner'

import * as styles from './GamePage.css'
import * as homeCornerStyles from './HomeCorner/HomeCorner.css'

type GameStatus = 'idle' | 'playing' | 'finished'

function resolveRoundQuestionCount(): number {
  return preferencesService.resolveQuestionCount(
    preferencesService.read().round,
    COUNTRIES.length,
  )
}

export function GamePage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    quizService.generateQuizQuestions(COUNTRIES, resolveRoundQuestionCount()),
  )
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [sfxEnabled, setSfxEnabled] = useState(
    () => preferencesService.read().sfxEnabled,
  )

  const playSuccess = useSfx(successSoundUrl)
  const playFail = useSfx(failSoundUrl)

  const elapsedMs = useStopwatch(gameStatus === 'playing')

  const finishRound = useCallback(
    (finalScore: number) => {
      statisticsService.appendSession({
        completedAt: new Date().toISOString(),
        score: finalScore,
        questionCount: questions.length,
        roundDurationMs: Math.round(elapsedMs),
      })
      setGameStatus('finished')
    },
    [questions.length, elapsedMs],
  )

  const formatElapsed = (ms: number) => {
    const totalTenths = Math.floor(ms / 100)
    const m = Math.floor(totalTenths / 600)
    const s = Math.floor((totalTenths % 600) / 10)
    const t = totalTenths % 10
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${t}`
  }

  const handleStart = () => {
    setQuestions(
      quizService.generateQuizQuestions(COUNTRIES, resolveRoundQuestionCount()),
    )
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setSfxEnabled(preferencesService.read().sfxEnabled)
    setGameStatus('playing')
  }

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)
      const correct = quizService.isCorrectAnswer(
        questions[currentQuestionIndex],
        answer,
      )
      const nextScore = correct ? score + 1 : score
      if (correct) {
        setScore((s) => s + 1)
        if (sfxEnabled) {
          playSuccess()
        }
      } else if (sfxEnabled) {
        playFail()
      }
      if (currentQuestionIndex === questions.length - 1) {
        finishRound(nextScore)
      }
    },
    [
      questions,
      currentQuestionIndex,
      score,
      finishRound,
      playSuccess,
      playFail,
      sfxEnabled,
    ],
  )

  useKeyPress(
    ['1', '2', '3', '4'],
    (e) => {
      const idx = Number(e.key) - 1
      const option = questions[currentQuestionIndex]?.options[idx]
      if (option) handleSelectAnswer(option)
    },
    { enabled: gameStatus === 'playing' && selectedAnswer === null },
  )

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1)
      setSelectedAnswer(null)
    }
  }, [currentQuestionIndex, questions.length])

  const canPressNext = useMemo(() => {
    if (gameStatus !== 'playing' || selectedAnswer === null) {
      return false
    }
    return currentQuestionIndex < questions.length - 1
  }, [gameStatus, selectedAnswer, currentQuestionIndex, questions.length])

  useKeyPress([' '], handleNext, { enabled: canPressNext })

  if (gameStatus === 'idle') {
    return (
      <div>
        <h1>Geo Quiz</h1>
        <Button onClick={handleStart}>Start Game</Button>
      </div>
    )
  }

  if (gameStatus === 'finished') {
    return (
      <FinishedState
        score={score}
        totalQuestions={questions.length}
        timeLabel={formatElapsed(elapsedMs)}
        onPlayAgain={handleStart}
      />
    )
  }

  const question = questions[currentQuestionIndex]
  const answeredQuestionsCount =
    currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)

  const handleToggleSfx = () => {
    setSfxEnabled((prev) => {
      const next = !prev
      const prefs = preferencesService.read()
      preferencesService.write({ ...prefs, sfxEnabled: next })
      return next
    })
  }

  const getOptionVariant = (option: string): ButtonQuizVariant => {
    if (selectedAnswer === null) {
      return 'default'
    }

    if (quizService.isCorrectAnswer(question, option)) {
      return 'success'
    }

    if (option === selectedAnswer) {
      return 'error'
    }

    return 'default'
  }

  return (
    <div className={styles.container}>
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>
            Progress: {answeredQuestionsCount} / {questions.length}
          </span>
          <span>Score: {score}</span>
          <div className={styles.progressHeaderRight}>
            <SfxToggleButton
              sfxEnabled={sfxEnabled}
              onClick={handleToggleSfx}
            />
            <div className={styles.timer}>
              <Clock className={styles.timerIcon} strokeWidth={3} size={20} />
              {formatElapsed(elapsedMs)}
            </div>
          </div>
        </div>
        <ProgressBar value={answeredQuestionsCount} max={questions.length} />
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
              disabled={selectedAnswer !== null}
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
          {selectedAnswer !== null &&
            currentQuestionIndex < questions.length - 1 && (
              <>
                <Button onClick={handleNext} className={styles.nextButton}>
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
