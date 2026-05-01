import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@shared/ui'

import * as styles from './StatsPage.css'

const statItems = [
  { value: '1', label: 'Games Played' },
  { value: '0%', label: 'Average Score' },
  { value: '0 / 10', label: 'Best Score' },
  { value: '0m', label: 'Total Time Played' },
  { value: '0%', label: 'Overall Accuracy' },
  { value: '0', label: 'Best Streak' },
] as const

export const StatsPage = () => {
  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Statistics</h1>
        <div className={styles.grid}>
          {statItems.map((item) => (
            <div key={item.label} className={styles.card}>
              <span className={styles.cardValue}>{item.value}</span>
              <span className={styles.cardLabel}>{item.label}</span>
            </div>
          ))}
        </div>
        <Button
          as={Link}
          to="/"
          variant="transparent"
          icon={<ArrowLeft size={18} strokeWidth={2} aria-hidden />}
        >
          Back to Start
        </Button>
      </main>
    </div>
  )
}
