import { useEffect } from 'preact/hooks'

export const useBeforeUnload = (callback: () => void, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return

    const handleBeforeUnload = () => {
      callback()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [callback, enabled])
}

