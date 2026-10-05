import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type FakeSentinel = { released: boolean; release: ReturnType<typeof vi.fn> }

describe('useWakeLock', () => {
  let sentinels: FakeSentinel[]

  beforeEach(() => {
    sentinels = []

    Object.defineProperty(navigator, 'wakeLock', {
      value: {
        request: vi.fn(async () => {
          const sentinel: FakeSentinel = {
            released: false,
            release: vi.fn(async () => {
              sentinel.released = true
            }),
          }
          sentinels.push(sentinel)
          return sentinel
        }),
      },
      configurable: true,
    })

    vi.resetModules()
    vi.doMock('../../constants/device', () => ({ DEVICE_CAN_SLEEP: true }))
  })

  afterEach(() => {
    vi.doUnmock('../../constants/device')
  })

  it('keeps the screen awake while enabled and releases the lock when turned off', async () => {
    const { useWakeLock } = await import('../use-wake-lock')
    const { rerender } = renderHook(({ enabled }) => useWakeLock(enabled), {
      initialProps: { enabled: true },
    })

    await waitFor(() => expect(sentinels).toHaveLength(1))
    expect(sentinels[0].released).toBe(false)

    rerender({ enabled: false })

    await waitFor(() => expect(sentinels[0].released).toBe(true))
  })

  it('releases the lock when the component unmounts', async () => {
    const { useWakeLock } = await import('../use-wake-lock')
    const { unmount } = renderHook(() => useWakeLock(true))

    await waitFor(() => expect(sentinels).toHaveLength(1))

    unmount()

    await waitFor(() => expect(sentinels[0].released).toBe(true))
  })

  it('takes the lock again when the page becomes visible', async () => {
    const { useWakeLock } = await import('../use-wake-lock')
    renderHook(() => useWakeLock(true))

    await waitFor(() => expect(sentinels).toHaveLength(1))

    // The browser drops the lock when the page is hidden
    sentinels[0].released = true
    document.dispatchEvent(new Event('visibilitychange'))

    await waitFor(() => expect(sentinels).toHaveLength(2))
    expect(sentinels[1].released).toBe(false)
  })
})
