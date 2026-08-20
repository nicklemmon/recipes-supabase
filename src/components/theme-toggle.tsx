import { Toggle } from '@base-ui/react/toggle'
import { ToggleGroup } from '@base-ui/react/toggle-group'
import { THEME_OPTIONS, isThemePreference } from '../helpers/theme'
import { cn } from '../helpers/dom'
import { useTheme } from '../hooks/use-theme'

type ThemeToggleProps = {
  className?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

/** Segmented control for choosing system, light, or dark theme */
export function ThemeToggle({
  className,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel = 'Theme',
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup
      value={[theme]}
      onValueChange={(values) => {
        const next = values[0]
        if (!isThemePreference(next)) return
        setTheme(next)
      }}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      className={cn(
        'inline-flex w-fit rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5',
        className,
      )}
    >
      {THEME_OPTIONS.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition',
            'text-slate-600 dark:text-zinc-300',
            'hover:bg-indigo-50 dark:hover:bg-zinc-700',
            'focus-visible:outline-0 focus-visible:ring-2 ring-indigo-700 dark:ring-indigo-500',
            'data-pressed:bg-indigo-600 data-pressed:text-indigo-50',
            'dark:data-pressed:bg-indigo-600 dark:data-pressed:text-indigo-50',
          )}
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
