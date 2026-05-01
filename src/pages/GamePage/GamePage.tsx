import { useCallback, useState } from 'react'
import { useKeyPress, useSfx, useStopwatch } from '@shared/hooks'
import { Button, ProgressBar } from '@shared/ui'
import { COUNTRIES } from '@entities/country/model/country.data'
import { quizService, type QuizQuestion } from '@entities/quiz'
import * as styles from './GamePage.css'
import {
  ButtonQuiz,
  type ButtonQuizVariant,
} from '@shared/ui/ButtonQuiz/ButtonQuiz'
import failSoundUrl from '../../assets/fail.wav?url'
import successSoundUrl from '../../assets/success.wav?url'

type GameStatus = 'idle' | 'playing' | 'finished'

export function GamePage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    quizService.generateQuizQuestions(COUNTRIES),
  )
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const playSuccess = useSfx(successSoundUrl)
  const playFail = useSfx(failSoundUrl)

  const elapsedMs = useStopwatch(gameStatus === 'playing')

  const formatElapsed = (ms: number) => {
    const totalTenths = Math.floor(ms / 100)
    const m = Math.floor(totalTenths / 600)
    const s = Math.floor((totalTenths % 600) / 10)
    const t = totalTenths % 10
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${t}`
  }

  const handleStart = () => {
    setQuestions(quizService.generateQuizQuestions(COUNTRIES))
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setGameStatus('playing')
  }

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)
      const correct = quizService.isCorrectAnswer(
        questions[currentQuestionIndex],
        answer,
      )
      if (correct) {
        setScore((s) => s + 1)
        playSuccess()
      } else {
        playFail()
      }
    },
    [questions, currentQuestionIndex, playSuccess, playFail],
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

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setGameStatus('finished')
    } else {
      setCurrentQuestionIndex((i) => i + 1)
      setSelectedAnswer(null)
    }
  }

  useKeyPress([' '], handleNext, {
    enabled: gameStatus === 'playing' && selectedAnswer !== null,
  })

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
      <div>
        <h2>Game Over!</h2>
        <p>
          Score: {score} / {questions.length}
        </p>
        <p>Time: {formatElapsed(elapsedMs)}</p>
        <Button onClick={handleStart}>Play Again</Button>
      </div>
    )
  }

  const question = questions[currentQuestionIndex]
  const answeredQuestionsCount =
    currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)

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
          <div className={styles.timer}>{formatElapsed(elapsedMs)}</div>
        </div>
        <ProgressBar value={answeredQuestionsCount} max={questions.length} />
      </div>
      <div className={styles.questionCard}>
        <h2 className={styles.title}>
          Which country does this flag belong to?
        </h2>
        <div style={{ fontSize: '6rem', textAlign: 'center' }}>
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
      {selectedAnswer !== null && (
        <div className={styles.nextSection}>
          <Button onClick={handleNext} className={styles.nextButton}>
            {currentQuestionIndex === questions.length - 1
              ? 'See Results'
              : 'Next'}
          </Button>
          <span className={styles.nextHint}>or press Space</span>
        </div>
      )}
    </div>
  )
}
