import { Link } from '@tanstack/react-router'

export function HomePage() {
  return (
    <div>
      <h1>Geo Quiz</h1>
      <Link to="/game">Start Game</Link>
    </div>
  )
}
