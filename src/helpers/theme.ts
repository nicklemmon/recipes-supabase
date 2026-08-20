import {
  THEME_OPTIONS,
  ThemePreferenceSchema,
  type ResolvedTheme,
  type ThemePreference,
} from '../types/theme'

export { THEME_OPTIONS, ThemePreferenceSchema }
export type { ResolvedTheme, ThemePreference }

export const THEME_STORAGE_KEY = 'theme-preference'

let stopWatchingSystemTheme: (() => void) | undefined

/** Returns true when the value is system, light, or dark */
export function isThemePreference(value: unknown): value is ThemePreference {
  return ThemePreferenceSchema.safeParse(value).success
}

/** Returns a valid theme, or system if the value is not one */
export function parseTheme(value: unknown): ThemePreference {
  const parsed = ThemePreferenceSchema.safeParse(value)
  return parsed.success ? parsed.data : 'system'
}

/** Reads the saved theme from localStorage */
export function getStoredTheme(): ThemePreference {
  try {
    return parseTheme(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

/** Saves the theme to localStorage */
export function setStoredTheme(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // If the browser blocks storage, the chosen theme still applies until the page is closed.
  }
}

/** Returns whether the operating system is set to dark mode */
export function prefersColorSchemeIsDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

/** Returns the theme that should actually render */
export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'light' || preference === 'dark') return preference

  return prefersColorSchemeIsDark() ? 'dark' : 'light'
}

/** Applies the resolved theme to the document */
export function applyTheme(preference: ThemePreference) {
  if (typeof document === 'undefined') return

  const resolved = resolveTheme(preference)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

/** Reads the saved theme and applies it */
export function applyStoredTheme() {
  watchSystemTheme()
  applyTheme(getStoredTheme())
}

/** Keeps the page in sync when the OS theme changes and the saved choice is system */
export function watchSystemTheme() {
  if (stopWatchingSystemTheme) return
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system')
    }
  }

  media.addEventListener('change', onChange)
  stopWatchingSystemTheme = () => {
    media.removeEventListener('change', onChange)
    stopWatchingSystemTheme = undefined
  }
}

/** Stops listening for OS theme changes. Used by tests. */
export function unwatchSystemTheme() {
  stopWatchingSystemTheme?.()
}
