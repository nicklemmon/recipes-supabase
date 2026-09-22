import { DEVICE_CAN_SLEEP } from '../constants/device'

/** The screen wake lock currently held, if any */
let wakeLock: WakeLockSentinel | null = null

/** Whether the app currently wants the screen to stay awake */
let wantsWakeLock = false

/** Prevent device sleep */
export async function preventSleep() {
  wantsWakeLock = true

  // Check if the Wake Lock API is supported
  if (!DEVICE_CAN_SLEEP) {
    console.error('Wake Lock API is not supported in this browser.')
    return
  }

  // Reuse the lock we already hold. The browser releases it when the page is hidden.
  if (wakeLock && !wakeLock.released) return wakeLock

  try {
    const lock = await navigator.wakeLock.request('screen')

    // Sleep was allowed again, or another request won, while this one was pending
    if (!wantsWakeLock || (wakeLock && !wakeLock.released)) {
      await lock.release()
      return wantsWakeLock ? (wakeLock ?? undefined) : undefined
    }

    wakeLock = lock

    return wakeLock
  } catch (err) {
    console.error('Failed to acquire Wake Lock:', err)
  }
}

/** Allow device sleep */
export async function allowSleep() {
  wantsWakeLock = false

  const lock = wakeLock
  wakeLock = null

  if (!lock || lock.released) return

  try {
    await lock.release()
  } catch (err) {
    console.error('Failed to release Wake Lock:', err)
  }
}
