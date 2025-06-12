import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('device sleep functions', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWakeLock: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRequest: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRelease: any

  beforeEach(() => {
    mockRelease = vi.fn()
    mockWakeLock = {
      release: mockRelease,
    }
    mockRequest = vi.fn().mockResolvedValue(mockWakeLock)

    // Mock navigator.wakeLock
    Object.defineProperty(navigator, 'wakeLock', {
      value: {
        request: mockRequest,
      },
      configurable: true,
    })

    // Clear console mocks
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Reset modules to ensure fresh imports
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.doUnmock('../constants/device')
  })

  describe('preventSleep', () => {
    it('should request wake lock when device can sleep', async () => {
      // Mock DEVICE_CAN_SLEEP to true
      vi.doMock('../constants/device', () => ({
        DEVICE_CAN_SLEEP: true,
      }))

      const { preventSleep } = await import('./device')
      const result = await preventSleep()

      expect(mockRequest).toHaveBeenCalledWith('screen')
      expect(result).toBe(mockWakeLock)
    })

    it('should handle wake lock request failure', async () => {
      // Mock DEVICE_CAN_SLEEP to true
      vi.doMock('../constants/device', () => ({
        DEVICE_CAN_SLEEP: true,
      }))

      const { preventSleep } = await import('./device')
      const error = new Error('Wake lock failed')
      mockRequest.mockRejectedValue(error)

      const result = await preventSleep()

      expect(console.error).toHaveBeenCalledWith('Failed to acquire Wake Lock:', error)
      expect(result).toBeUndefined()
    })

    it('should log error when wake lock is not supported', async () => {
      // Mock DEVICE_CAN_SLEEP to false
      vi.doMock('../constants/device', () => ({
        DEVICE_CAN_SLEEP: false,
      }))

      const { preventSleep } = await import('./device')
      const result = await preventSleep()

      expect(console.error).toHaveBeenCalledWith('Wake Lock API is not supported in this browser.')
      expect(result).toBeUndefined()
    })
  })

  describe('allowSleep', () => {
    it('should request and immediately release wake lock', async () => {
      // Mock DEVICE_CAN_SLEEP to true
      vi.doMock('../constants/device', () => ({
        DEVICE_CAN_SLEEP: true,
      }))

      const { allowSleep } = await import('./device')
      const result = await allowSleep()

      expect(mockRequest).toHaveBeenCalledWith('screen')
      expect(mockRelease).toHaveBeenCalled()
      expect(result).toBe(mockWakeLock)
    })

    it('should handle wake lock request failure', async () => {
      // Mock DEVICE_CAN_SLEEP to true
      vi.doMock('../constants/device', () => ({
        DEVICE_CAN_SLEEP: true,
      }))

      const { allowSleep } = await import('./device')
      const error = new Error('Wake lock failed')
      mockRequest.mockRejectedValue(error)

      const result = await allowSleep()

      expect(console.error).toHaveBeenCalledWith('Failed to acquire Wake Lock:', error)
      expect(result).toBeUndefined()
    })

    it('should log error when wake lock is not supported', async () => {
      // Mock DEVICE_CAN_SLEEP to false
      vi.doMock('../constants/device', () => ({
        DEVICE_CAN_SLEEP: false,
      }))

      const { allowSleep } = await import('./device')
      const result = await allowSleep()

      expect(console.error).toHaveBeenCalledWith('Wake Lock API is not supported in this browser.')
      expect(result).toBeUndefined()
    })
  })
})
