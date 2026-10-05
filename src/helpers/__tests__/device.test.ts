import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

type FakeSentinel = { released: boolean; release: ReturnType<typeof vi.fn> }

/** Creates a lock that behaves like a WakeLockSentinel */
function createSentinel(): FakeSentinel {
  const sentinel: FakeSentinel = {
    released: false,
    release: vi.fn(async () => {
      sentinel.released = true
    }),
  }
  return sentinel
}

describe('device sleep functions', () => {
  let sentinels: FakeSentinel[]
  let mockRequest: ReturnType<typeof vi.fn>

  beforeEach(() => {
    sentinels = []
    mockRequest = vi.fn(async () => {
      const sentinel = createSentinel()
      sentinels.push(sentinel)
      return sentinel
    })

    Object.defineProperty(navigator, 'wakeLock', {
      value: { request: mockRequest },
      configurable: true,
    })

    vi.spyOn(console, 'error').mockImplementation(() => {})

    // The helpers keep the held lock in module state, so start each test fresh
    vi.resetModules()
    vi.doMock('../../constants/device', () => ({ DEVICE_CAN_SLEEP: true }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.doUnmock('../../constants/device')
  })

  it('releases the lock that preventSleep acquired', async () => {
    const { preventSleep, allowSleep } = await import('../device')

    const lock = await preventSleep()
    await allowSleep()

    expect(lock).toBe(sentinels[0])
    expect(sentinels[0].released).toBe(true)
    // Allowing sleep must not ask the browser for another lock
    expect(sentinels).toHaveLength(1)
  })

  it('reuses a held lock instead of requesting a second one', async () => {
    const { preventSleep } = await import('../device')

    await preventSleep()
    await preventSleep()

    expect(sentinels).toHaveLength(1)
  })

  it('requests a new lock after the browser released the old one', async () => {
    const { preventSleep } = await import('../device')

    await preventSleep()
    // Browsers release the lock when the page is hidden
    sentinels[0].released = true
    const lock = await preventSleep()

    expect(sentinels).toHaveLength(2)
    expect(lock).toBe(sentinels[1])
  })

  it('releases a lock that arrives after sleep was allowed again', async () => {
    const { preventSleep, allowSleep } = await import('../device')

    const pending = preventSleep()
    await allowSleep()
    const lock = await pending

    expect(lock).toBeUndefined()
    expect(sentinels[0].released).toBe(true)
  })

  it('logs and returns undefined when the lock request fails', async () => {
    const { preventSleep } = await import('../device')
    const error = new Error('Wake lock failed')
    mockRequest.mockRejectedValueOnce(error)

    const result = await preventSleep()

    expect(console.error).toHaveBeenCalledWith('Failed to acquire Wake Lock:', error)
    expect(result).toBeUndefined()
  })

  it('does nothing when allowing sleep without a held lock', async () => {
    const { allowSleep } = await import('../device')

    await allowSleep()

    expect(mockRequest).not.toHaveBeenCalled()
  })
})
