import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  THEME_STORAGE_KEY,
  applyStoredTheme,
  applyTheme,
  getStoredTheme,
  parseTheme,
  resolveTheme,
  setStoredTheme,
} from '../theme'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

describe('parseTheme', () => {
  it('returns system, light, and dark unchanged', () => {
    expect(parseTheme('system')).toBe('system')
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme('dark')).toBe('dark')
  })

  it('falls back to system for invalid values', () => {
    expect(parseTheme(null)).toBe('system')
    expect(parseTheme(undefined)).toBe('system')
    expect(parseTheme('auto')).toBe('system')
    expect(parseTheme('')).toBe('system')
  })
})

describe('getStoredTheme and setStoredTheme', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns system when nothing is stored', () => {
    expect(getStoredTheme()).toBe('system')
  })

  it('returns the stored preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(getStoredTheme()).toBe('dark')
  })

  it('returns system when the stored value is invalid', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'neon')
    expect(getStoredTheme()).toBe('system')
  })

  it('returns system when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(getStoredTheme()).toBe('system')
  })

  it('writes the preference to localStorage', () => {
    setStoredTheme('light')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })
})

describe('resolveTheme', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns light and dark preferences as-is', () => {
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
  })

  it('follows the OS when preference is system and the OS is dark', () => {
    mockMatchMedia(true)
    expect(resolveTheme('system')).toBe('dark')
  })

  it('follows the OS when preference is system and the OS is light', () => {
    mockMatchMedia(false)
    expect(resolveTheme('system')).toBe('light')
  })
})

describe('applyTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('adds the dark class for the dark preference', () => {
    applyTheme('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('removes the dark class for the light preference', () => {
    document.documentElement.classList.add('dark')
    applyTheme('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('adds the dark class when system preference matches a dark OS', () => {
    mockMatchMedia(true)
    applyTheme('system')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('removes the dark class when system preference matches a light OS', () => {
    mockMatchMedia(false)
    document.documentElement.classList.add('dark')
    applyTheme('system')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('still follows the OS when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    mockMatchMedia(true)
    applyStoredTheme()
    expect(document.documentElement).toHaveClass('dark')
  })
})
