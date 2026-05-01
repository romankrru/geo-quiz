import { useEffect, useRef, useState } from 'react'

export function useStopwatch(running: boolean, tickMs = 100): number {
  const [elapsedMs, setElapsedMs] = useState(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) {
      if (startTimeRef.current !== null) {
        setElapsedMs(performance.now() - startTimeRef.current)
        startTimeRef.current = null
      }
      return
    }

    startTimeRef.current = performance.now()
    setElapsedMs(0)

    const id = setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsedMs(performance.now() - startTimeRef.current)
      }
    }, tickMs)

    return () => clearInterval(id)
  }, [running, tickMs])

  return elapsedMs
}
