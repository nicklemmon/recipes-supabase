import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  THEME_STORAGE_KEY,
  applyStoredTheme,
  applyTheme,
  getStoredTheme,
  parseTheme,
  resolveTheme,
  setStoredTheme,
  unwatchSystemTheme,
  watchSystemTheme,
} from '../theme'

function mockMatchMedia(matches: boolean, listeners?: Array<() => void>) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: (_event: string, cb: () => void) => {
        listeners?.push(cb)
      },
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
    unwatchSystemTheme()
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

describe('watchSystemTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
    unwatchSystemTheme()
    vi.unstubAllGlobals()
  })

  it('re-applies system theme when the OS preference changes', () => {
    const listeners: Array<() => void> = []
    mockMatchMedia(false, listeners)
    localStorage.setItem(THEME_STORAGE_KEY, 'system')
    document.documentElement.classList.remove('dark')

    watchSystemTheme()
    expect(listeners).toHaveLength(1)

    mockMatchMedia(true)
    listeners[0]()

    expect(document.documentElement).toHaveClass('dark')
  })
})

describe('first-paint script', () => {
  it('uses the same storage key and does not abort theming when storage fails', () => {
    const html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf8')

    expect(html).toContain(`localStorage.getItem('${THEME_STORAGE_KEY}')`)
    expect(html).toContain("preference = 'system'")
    expect(html).toContain("typeof window.matchMedia === 'function'")
    expect(html).toContain("document.documentElement.classList.toggle('dark', isDark)")

    const script = html.slice(html.indexOf('(function ()'), html.indexOf('})()'))
    const storageTryEnd = script.indexOf('} catch (e) {}')
    const toggleCall = script.indexOf("classList.toggle('dark', isDark)")
    expect(storageTryEnd).toBeGreaterThan(-1)
    expect(toggleCall).toBeGreaterThan(storageTryEnd)
  })
})
