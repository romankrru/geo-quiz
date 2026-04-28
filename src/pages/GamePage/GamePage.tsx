import { type CSSProperties, useState } from 'react'
import { Button } from '@shared/ui'
import { COUNTRIES } from '@entities/country/model/country.data'

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

    const options = [...distractors, country.name].sort(() => Math.random() - 0.5)

    return {
      id: country.id,
      flagEmoji: country.flagEmoji,
      options,
      correctAnswer: country.name,
    }
  })
}

export function GamePage() {
  const [questions, setQuestions] = useState<Question[]>(() => generateQuestions())
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle')
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

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setGameStatus('finished')
    } else {
      setCurrentQuestionIndex((i) => i + 1)
      setSelectedAnswer(null)
    }
  }

  const getOptionStyle = (option: string): CSSProperties => {
    if (selectedAnswer === null) return {}
    if (option === questions[currentQuestionIndex].correctAnswer)
      return { backgroundColor: 'green', color: 'white' }
    if (option === selectedAnswer) return { backgroundColor: 'red', color: 'white' }
    return {}
  }

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

  return (
    <div>
      <div>
        Question {currentQuestionIndex + 1} / {questions.length} · Score: {score}
      </div>
      <div style={{ fontSize: '6rem' }}>{question.flagEmoji}</div>
      <p>Which country does this flag belong to?</p>
      <div>
        {question.options.map((option) => (
          <Button
            key={option}
            onClick={() => handleSelectAnswer(option)}
            disabled={selectedAnswer !== null}
            style={getOptionStyle(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      {selectedAnswer !== null && (
        <Button onClick={handleNext}>
          {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next'}
        </Button>
      )}
    </div>
  )
}
