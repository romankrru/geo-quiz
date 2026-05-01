import { useCallback, useState } from 'react'
import { useKeyPress } from '@shared/hooks'
import { Button, ProgressBar } from '@shared/ui'
import { COUNTRIES } from '@entities/country/model/country.data'
import * as styles from './GamePage.css'
import {
  ButtonQuiz,
  type ButtonQuizVariant,
} from '@shared/ui/ButtonQuiz/ButtonQuiz'

type GameStatus = 'idle' | 'playing' | 'finished'

type Question = {
  id: string
  flagEmoji: string
  options: string[]
  correctAnswer: string
}

const generateQuestions = (n = 10): Question[] => {
  const shuffled = [...COUNTRIES].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, n)

  return selected.map((country) => {
    const distractors = COUNTRIES.filter((c) => c.id !== country.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.name)

    const options = [...distractors, country.name].sort(
      () => Math.random() - 0.5,
    )

    return {
      id: country.id,
      flagEmoji: country.flagEmoji,
      options,
      correctAnswer: country.name,
    }
  })
}

export function GamePage() {
  const [questions, setQuestions] = useState<Question[]>(() =>
    generateQuestions(),
  )
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const handleStart = () => {
    setQuestions(generateQuestions())
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setGameStatus('playing')
  }

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)
      if (answer === questions[currentQuestionIndex].correctAnswer) {
        setScore((s) => s + 1)
      }
    },
    [questions, currentQuestionIndex],
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

    if (option === question.correctAnswer) {
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
        </div>
        <ProgressBar value={answeredQuestionsCount} max={questions.length} />
      </div>
      <div className={styles.questionCard}>
        <h2>Which country does this flag belong to?</h2>
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
        <Button onClick={handleNext} className={styles.nextButton}>
          {currentQuestionIndex === questions.length - 1
            ? 'See Results'
            : 'Next'}
        </Button>
      )}
    </div>
  )
}
