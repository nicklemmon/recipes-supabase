import { z } from 'zod'

export const ThemePreferenceSchema = z.enum(['system', 'light', 'dark'])

export type ThemePreference = z.infer<typeof ThemePreferenceSchema>

export const ResolvedThemeSchema = z.enum(['light', 'dark'])

export type ResolvedTheme = z.infer<typeof ResolvedThemeSchema>

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]
