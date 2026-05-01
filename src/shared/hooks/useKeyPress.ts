import { useEffect, useRef } from 'react'

type UseKeyPressOptions = {
  enabled?: boolean
  ignoreEditableTargets?: boolean
  preventDefaultOnMatch?: boolean
}

export function useKeyPress(
  keys: readonly string[],
  callback: (event: KeyboardEvent) => void,
  options?: UseKeyPressOptions,
): void {
  const enabled = options?.enabled !== false
  const ignoreEditableTargets = options?.ignoreEditableTargets !== false
  const preventDefaultOnMatch = options?.preventDefaultOnMatch !== false

  const keysRef = useRef(keys)
  const callbackRef = useRef(callback)

  useEffect(() => {
    keysRef.current = keys
    callbackRef.current = callback
  }, [keys, callback])

  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      if (ignoreEditableTargets) {
        const t = event.target
        if (
          t instanceof Element &&
          t.closest('input, textarea, [contenteditable="true"]')
        ) {
          return
        }
      }

      const keySet = new Set(keysRef.current)
      if (!keySet.has(event.key)) return

      if (preventDefaultOnMatch) {
        event.preventDefault()
      }

      callbackRef.current(event)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled, ignoreEditableTargets, preventDefaultOnMatch])
}
