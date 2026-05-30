export type QuizQuestion = {
  id: string
  flagEmoji: string
  options: string[]
  correctAnswer: string
}

export type RoundAnswerReviewEntry = {
  questionNumber: number
  flagEmoji: string
  correctAnswer: string
  selectedAnswer: string
  isCorrect: boolean
}
