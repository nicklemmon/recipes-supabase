import { act } from 'react'
import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../use-theme'
import { THEME_STORAGE_KEY } from '../../helpers/theme'

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
    vi.unstubAllGlobals()
  })

  it('re-applies the theme when the OS preference changes and the choice is system', () => {
    const listeners: Array<() => void> = []
    let matches = false

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        get matches() {
          return matches
        },
        media: query,
        addEventListener: (_event: string, cb: () => void) => {
          listeners.push(cb)
        },
        removeEventListener: vi.fn(),
      })),
    })

    localStorage.setItem(THEME_STORAGE_KEY, 'system')
    render(
      <ThemeProvider>
        <div>child</div>
      </ThemeProvider>,
    )

    expect(document.documentElement).not.toHaveClass('dark')

    act(() => {
      matches = true
      listeners.forEach((listener) => listener())
    })

    expect(document.documentElement).toHaveClass('dark')
  })
})
