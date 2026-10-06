import { useEffect } from 'react'
import { allowSleep, preventSleep } from '../helpers/device'

/**
 * Keeps the screen awake while `enabled` is true. Takes the lock again when the page becomes
 * visible (browsers drop it when the page is hidden) and releases it on unmount.
 */
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    void preventSleep()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void preventSleep()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      void allowSleep()
    }
  }, [enabled])
}
