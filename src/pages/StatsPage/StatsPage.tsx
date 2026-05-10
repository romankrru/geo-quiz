import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  type QuizSessionRecord,
  STATISTICS_STORE_CHANGED_EVENT,
  statisticsService,
} from '@entities/statistics'
import { Button, ConfirmDialog } from '@shared/ui'

import { EmptyMessage } from './EmptyMessage/EmptyMessage'

import * as styles from './StatsPage.css'

type StatCardItem = {
  value: string
  label: string
  hint?: string
}

const getStatHintId = (label: string) =>
  `stats-card-hint-${label.replaceAll(/\s+/g, '-').toLowerCase()}`

export const StatsPage = () => {
  const [sessions, setSessions] = useState<QuizSessionRecord[]>(() =>
    statisticsService.read(),
  )
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  // Keep sessions in sync with localStorage: custom event fires in this tab after writes
  // (the native `storage` event does not); `storage` catches updates from other tabs.
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
  const bestScore = statisticsService.computeBestScoreStatistics(sessions)
  const bestStreak = statisticsService.computeBestStreakStatistics(sessions)

  const totalRoundMs = statisticsService.computeTotalRoundDurationMs(sessions)
  const totalTimePlayed = statisticsService.formatTotalTimePlayed(totalRoundMs)

  const statItems: StatCardItem[] = [
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
      value:
        bestScore !== null
          ? statisticsService.formatBestScoreStatistics(bestScore)
          : '—',
      label: 'Best Score',
      hint: 'Best single-game accuracy (score ÷ questions); ties favor longer games.',
    },
    {
      value: totalTimePlayed,
      label: 'Total Time Played',
      hint: 'Idle on results not counted.',
    },
    {
      value:
        overallAccuracy !== null
          ? statisticsService.formatStatisticsPercentage(overallAccuracy)
          : '—',
      label: 'Overall Accuracy',
    },
    {
      value: String(bestStreak),
      label: 'Best Streak',
      hint: 'Perfect games in a row, by finish time; one miss resets the count.',
    },
  ]

  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Statistics</h1>
        <div className={styles.grid}>
          {statItems.map((item) => {
            const hintDomId = item.hint ? getStatHintId(item.label) : undefined
            return (
              <div
                key={item.label}
                className={styles.card}
                role="group"
                aria-label={item.label}
                aria-describedby={hintDomId}
              >
                <span className={styles.cardValue}>{item.value}</span>
                <span className={styles.cardLabel}>{item.label}</span>
                {item.hint ? (
                  <p className={styles.cardHint} id={hintDomId}>
                    {item.hint}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
        <Button
          as={Link}
          to="/"
          variant="transparent"
          icon={<ArrowLeft size={18} strokeWidth={2} aria-hidden />}
        >
          Back to Start
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => setIsResetDialogOpen(true)}
        >
          Reset Statistics
        </Button>
      </main>
      {isResetDialogOpen ? (
        <ConfirmDialog
          title="Reset Statistics"
          body="This permanently clears your statistics on this device and can't be undone. It only affects this device."
          confirmLabel="Reset"
          cancelLabel="Cancel"
          confirmVariant="destructive"
          onCancel={() => setIsResetDialogOpen(false)}
          onConfirm={() => {
            statisticsService.clear()
            setIsResetDialogOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
