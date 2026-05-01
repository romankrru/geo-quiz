import { Link } from '@tanstack/react-router'

import { Button } from '@shared/ui/Button/Button'

import * as styles from './HomePage.css'

export function HomePage() {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h1 className={styles.title}>Geo Quiz</h1>
        <p className={styles.description}>
          Test your geography knowledge! Identify countries by their flags.
          Track your score and compete with yourself.
        </p>
        <div className={styles.actions}>
          <Button as={Link} to="/game">
            Start Game
          </Button>
          <Button as={Link} to="/stats" variant="transparent">
            View Statistics
          </Button>
        </div>
      </div>
    </div>
  )
}
