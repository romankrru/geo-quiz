import { useCallback } from 'react'

export function useCopyToClipboard(): (text: string) => Promise<boolean> {
  return useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard?.writeText(text)
      return true
    } catch {
      return false
    }
  }, [])
}
