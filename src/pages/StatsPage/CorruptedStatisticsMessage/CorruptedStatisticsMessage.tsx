import { Link } from '@tanstack/react-router'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { statisticsService } from '@entities/statistics'
import { Button, ConfirmDialog } from '@shared/ui'

import * as pageStyles from '../StatsPage.css'
import * as styles from './CorruptedStatisticsMessage.css'

export const CorruptedStatisticsMessage = () => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  return (
    <div className={pageStyles.root}>
      <main className={pageStyles.main}>
        <h1 className={pageStyles.pageTitle}>Statistics</h1>
        <p className={styles.message}>
          Your statistics data on this device could not be read. You can clear
          it and start fresh, or reload the page to try again.
        </p>
        <div className={pageStyles.mainActions}>
          <Button
            type="button"
            variant="transparent"
            onClick={() => {
              window.location.reload()
            }}
          >
            Reload page
          </Button>
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
            variant="transparent"
            icon={<Trash2 size={18} strokeWidth={2} aria-hidden />}
            onClick={() => setIsResetDialogOpen(true)}
          >
            Clear broken data
          </Button>
        </div>
      </main>
      {isResetDialogOpen ? (
        <ConfirmDialog
          title="Clear statistics"
          body="This removes unreadable statistics from this browser on this device only. New quizzes can be recorded again after you clear."
          confirmLabel="Clear"
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
