// url=https://www.figma.com/design/mF6ueBDvbEV3CzIFCZgpja/geo-quiz-—-UI-library?node-id=8-7
// source=https://geo-quiz-storybook-nf449ky6o-romankrrus-projects.vercel.app/?path=/docs/shared-ui-button--docs
// component=Button
import figma from 'figma'

const instance = figma.selectedInstance

const labelLayer = instance.findText('Label')
const label =
  labelLayer.type === 'TEXT' ? labelLayer.textContent : 'Button'

const variant = instance.getEnum('variant', {
  solid: 'solid',
  danger: 'danger',
  transparent: 'transparent',
})

export default {
  example: figma.code`
    <Button variant="${variant}">
      ${label}
    </Button>
  `,
  imports: ['import { Button } from "@shared/ui/Button/Button"'],
  id: 'button',
  metadata: { nestable: true },
}
