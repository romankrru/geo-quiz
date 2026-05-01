import { useCallback, useEffect } from 'react'

const audioCache = new Map<string, HTMLAudioElement>()

function getAudio(url: string): HTMLAudioElement {
  let audio = audioCache.get(url)
  if (!audio) {
    audio = new Audio(url)
    audio.preload = 'auto'
    void audio.load()
    audioCache.set(url, audio)
  }
  return audio
}

export function useSfx(url: string): () => void {
  useEffect(() => {
    getAudio(url)
  }, [url])

  return useCallback(() => {
    const audio = getAudio(url)
    audio.currentTime = 0
    void audio.play()
  }, [url])
}
