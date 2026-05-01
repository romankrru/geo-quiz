import { Link } from '@tanstack/react-router'
import { Button } from '@shared/ui'
import { ArrowLeft } from 'lucide-react'

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
