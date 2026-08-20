import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import {
  applyStoredTheme,
  applyTheme,
  getStoredTheme,
  prefersColorSchemeIsDark,
  setStoredTheme,
  watchSystemTheme,
  type ThemePreference,
} from '../helpers/theme'

type ThemeContextValue = {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function subscribeToSystemTheme(onStoreChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {}

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', onStoreChange)
  return () => media.removeEventListener('change', onStoreChange)
}

/** Shares the theme choice with the rest of the app */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    applyStoredTheme()
    return getStoredTheme()
  })

  const systemIsDark = useSyncExternalStore(
    subscribeToSystemTheme,
    prefersColorSchemeIsDark,
    () => false,
  )

  useEffect(() => {
    watchSystemTheme()
    applyTheme(theme)
  }, [theme, systemIsDark])

  const setTheme = useCallback((next: ThemePreference) => {
    setStoredTheme(next)
    applyTheme(next)
    setThemeState(next)
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** Returns the current theme choice */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
