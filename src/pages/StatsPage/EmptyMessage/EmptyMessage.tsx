import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@shared/ui'

import { statsPageStrings } from '../StatsPage.strings'

import * as pageStyles from '../StatsPage.css'
import * as emptyStyles from './EmptyMessage.css'

export const EmptyMessage = () => {
  return (
    <div className={pageStyles.root}>
      <main className={pageStyles.main}>
        <h1 className={pageStyles.pageTitle}>{statsPageStrings.pageTitle}</h1>
        <p className={emptyStyles.message}>{statsPageStrings.emptyMessage}</p>
        <Button
          as={Link}
          to="/"
          variant="transparent"
          icon={<ArrowLeft size={18} strokeWidth={2} aria-hidden />}
        >
          {statsPageStrings.backToStart}
        </Button>
      </main>
    </div>
  )
}
