export const THEME_STORAGE_KEY = 'theme-preference'

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const

export type ThemePreference = (typeof THEME_PREFERENCES)[number]

export type ResolvedTheme = 'light' | 'dark'

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

/** Returns true when the value is a stored theme preference */
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

/** Coerces an unknown value to a theme preference, defaulting to system */
export function parseTheme(value: unknown): ThemePreference {
  return isThemePreference(value) ? value : 'system'
}

/** Reads the saved theme preference from localStorage */
export function getStoredTheme(): ThemePreference {
  try {
    return parseTheme(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

/** Writes the theme preference to localStorage */
export function setStoredTheme(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Ignore quota / private-mode failures; the in-memory theme still applies.
  }
}

/** Resolves a preference to the theme that should actually render */
export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'light' || preference === 'dark') return preference

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Applies the resolved theme to the document */
export function applyTheme(preference: ThemePreference) {
  if (typeof document === 'undefined') return

  const resolved = resolveTheme(preference)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}
