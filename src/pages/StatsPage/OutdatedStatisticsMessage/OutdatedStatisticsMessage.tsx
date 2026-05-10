import { Link } from '@tanstack/react-router'
import { ArrowLeft, RefreshCw } from 'lucide-react'

import { Button } from '@shared/ui'

import * as pageStyles from '../StatsPage.css'
import * as styles from './OutdatedStatisticsMessage.css'

type Props = {
  persistedSchemaVersion: number
}

export const OutdatedStatisticsMessage = (props: Props) => {
  return (
    <div className={pageStyles.root}>
      <main className={pageStyles.main}>
        <h1 className={pageStyles.pageTitle}>Statistics</h1>
        <p className={styles.message}>
          Your saved statistics use a newer format (version{' '}
          {props.persistedSchemaVersion}) than this build understands. Reload or
          refresh the page after updating the app so statistics can load
          correctly. This page will not show numbers or change your data until
          then.
        </p>
        <div className={pageStyles.mainActions}>
          <Button
            type="button"
            variant="transparent"
            icon={<RefreshCw size={18} strokeWidth={2} aria-hidden />}
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
        </div>
      </main>
    </div>
  )
}
