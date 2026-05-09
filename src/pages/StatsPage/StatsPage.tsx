import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  type QuizSessionRecord,
  STATISTICS_STORE_CHANGED_EVENT,
  statisticsService,
} from '@entities/statistics'
import { Button } from '@shared/ui'

import { EmptyMessage } from './EmptyMessage/EmptyMessage'

import * as styles from './StatsPage.css'

export const StatsPage = () => {
  const [sessions, setSessions] = useState<QuizSessionRecord[]>(() =>
    statisticsService.read(),
  )

  useEffect(() => {
    const sync = () => {
      setSessions(statisticsService.read())
    }
    sync()
    window.addEventListener(STATISTICS_STORE_CHANGED_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(STATISTICS_STORE_CHANGED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (sessions.length === 0) {
    return <EmptyMessage />
  }

  const averageScore = statisticsService.computeAverageScoreStatistics(sessions)
  const overallAccuracy =
    statisticsService.computeOverallAccuracyStatistics(sessions)

  const totalRoundMs = sessions.reduce(
    (acc, session) => acc + session.roundDurationMs,
    0,
  )
  const totalMinutes = Math.floor(totalRoundMs / 60_000)

  const statItems = [
    {
      value: String(sessions.length),
      label: 'Games Played',
    },
    {
      value:
        averageScore !== null
          ? statisticsService.formatStatisticsPercentage(averageScore)
          : '—',
      label: 'Average Score',
    },
    {
      value: '—',
      label: 'Best Score',
    },
    {
      value: `${totalMinutes}m`,
      label: 'Total Time Played',
    },
    {
      value:
        overallAccuracy !== null
          ? statisticsService.formatStatisticsPercentage(overallAccuracy)
          : '—',
      label: 'Overall Accuracy',
    },
    {
      value: '—',
      label: 'Best Streak',
    },
  ] as const

  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Statistics</h1>
        <div className={styles.grid}>
          {statItems.map((item) => (
            <div
              key={item.label}
              className={styles.card}
              role="group"
              aria-label={item.label}
            >
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
