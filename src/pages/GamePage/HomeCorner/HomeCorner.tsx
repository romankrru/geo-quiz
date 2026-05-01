import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@shared/ui'

type Props = {
  className: string
}

export const HomeCorner = (props: Props) => (
  <div className={props.className}>
    <Button
      as={Link}
      to="/"
      variant="transparent"
      icon={<ArrowLeft size={18} strokeWidth={2} aria-hidden />}
    >
      Back to home
    </Button>
  </div>
)
