import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@shared/ui'

import * as pageStyles from '../StatsPage.css'
import * as emptyStyles from './EmptyMessage.css'

export const EmptyMessage = () => {
  return (
    <div className={pageStyles.root}>
      <main className={pageStyles.main}>
        <h1 className={pageStyles.pageTitle}>Statistics</h1>
        <p className={emptyStyles.message}>
          Nothing recorded yet. Finish a quiz to see your statistics.
        </p>
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
