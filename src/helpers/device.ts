/** Prevent device sleep */
export async function preventSleep() {
  try {
    // Check if the Wake Lock API is supported
    if ('wakeLock' in navigator) {
      // Request a screen wake lock
      const wakeLock = await navigator.wakeLock.request('screen')

      // Return the wake lock object to manage it manually later if needed
      return wakeLock
    } else {
      console.error('Wake Lock API is not supported in this browser.')
    }
  } catch (err) {
    console.error('Failed to acquire Wake Lock:', err)
  }
}

/** Allow device sleep */
export async function allowSleep() {
  try {
    // Check if the Wake Lock API is supported
    if ('wakeLock' in navigator) {
      // Request a screen wake lock
      const wakeLock = await navigator.wakeLock.request('screen')

      wakeLock.release()

      // Return the wake lock object to manage it manually later if needed
      return wakeLock
    } else {
      console.error('Wake Lock API is not supported in this browser.')
    }
  } catch (err) {
    console.error('Failed to acquire Wake Lock:', err)
  }
}
