import { Volume2, VolumeX } from 'lucide-react'

import { Button } from '@shared/ui'

type Props = {
  sfxEnabled: boolean
  onClick: () => void
}

export const SfxToggleButton = (props: Props) => {
  return (
    <Button
      type="button"
      variant="transparent"
      aria-pressed={props.sfxEnabled}
      aria-label={
        props.sfxEnabled
          ? 'Sound effects on. Press to turn off.'
          : 'Sound effects off. Press to turn on.'
      }
      icon={
        props.sfxEnabled ? (
          <Volume2 size={18} strokeWidth={3} aria-hidden />
        ) : (
          <VolumeX size={18} strokeWidth={3} aria-hidden />
        )
      }
      onClick={props.onClick}
    />
  )
}
