import { parseToRgb } from 'polished'

export function cssColorToHex(cssColor: string): string {
  const { red, green, blue } = parseToRgb(cssColor)
  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`
}
