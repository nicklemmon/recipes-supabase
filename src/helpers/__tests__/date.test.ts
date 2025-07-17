import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toLegibleDate } from '../date'

describe('toLegibleDate', () => {
  beforeEach(() => {
    // Mock navigator.language to have consistent test results
    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'en-US',
    })
  })

  it('should convert ISO timestamp to legible date with default locale', () => {
    const isoTimestamp = '2025-05-25T17:36:16.263769+00:00'
    const result = toLegibleDate(isoTimestamp)

    // The result will depend on the user's timezone, but should contain expected elements
    expect(result).toMatch(/May 25, 2025/)
    expect(result).toMatch(/PM|AM/)
  })

  it('should handle different locale formats', () => {
    const isoTimestamp = '2025-12-31T23:59:59.000000+00:00'
    const resultUS = toLegibleDate(isoTimestamp, 'en-US')
    const resultGB = toLegibleDate(isoTimestamp, 'en-GB')

    expect(resultUS).toMatch(/December 31, 2025/)
    expect(resultGB).toMatch(/31 December 2025/)
  })

  it('should handle different times of day', () => {
    const morningTime = '2025-01-01T09:30:00.000000+00:00'
    const eveningTime = '2025-01-01T21:45:00.000000+00:00'

    const morningResult = toLegibleDate(morningTime)
    const eveningResult = toLegibleDate(eveningTime)

    expect(morningResult).toMatch(/AM|PM/)
    expect(eveningResult).toMatch(/AM|PM/)
  })

  it('should handle leap year dates', () => {
    const leapYearDate = '2024-02-29T12:00:00.000000+00:00'
    const result = toLegibleDate(leapYearDate)

    expect(result).toMatch(/February 29, 2024/)
  })

  it('should handle timezone offsets properly', () => {
    const utcTime = '2025-06-15T12:00:00.000000+00:00'
    const offsetTime = '2025-06-15T12:00:00.000000-05:00'

    const utcResult = toLegibleDate(utcTime)
    const offsetResult = toLegibleDate(offsetTime)

    expect(utcResult).toMatch(/June 15, 2025/)
    expect(offsetResult).toMatch(/June 15, 2025/)
  })

  it('should handle invalid date strings gracefully', () => {
    const invalidDate = 'not-a-date'
    const result = toLegibleDate(invalidDate)

    expect(result).toBe('Invalid Date')
  })

  it('should use navigator.language as default when no locale provided', () => {
    const spy = vi.spyOn(Intl, 'DateTimeFormat')
    const isoTimestamp = '2025-01-01T12:00:00.000000+00:00'

    toLegibleDate(isoTimestamp)

    expect(spy).toHaveBeenCalledWith('en-US', expect.any(Object))
    spy.mockRestore()
  })
})
