import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { THEME_OPTIONS } from '../types/theme'
import { isThemePreference } from '../helpers/theme'
import { cn } from '../helpers/dom'
import { useTheme } from '../hooks/use-theme'
import { Inline } from './inline'

type ThemeToggleProps = {
  className?: string
  'aria-labelledby'?: string
  'aria-label'?: string
}

/** Choose system, light, or dark theme */
export function ThemeToggle({
  className,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel = 'Theme',
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <RadioGroup
      value={theme}
      onValueChange={(value) => {
        if (!isThemePreference(value)) return
        setTheme(value)
      }}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      className={cn(
        'w-fit rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5',
        className,
      )}
      render={(props) => {
        const { children, ...rest } = props
        return (
          <Inline spacing="0" {...rest}>
            {children}
          </Inline>
        )
      }}
    >
      {THEME_OPTIONS.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition',
            'text-slate-600 dark:text-zinc-300',
            'hover:bg-indigo-50 dark:hover:bg-zinc-700',
            'focus-visible:outline-0 focus-visible:ring-2 ring-indigo-700 dark:ring-indigo-500',
            'data-checked:bg-indigo-600 data-checked:text-indigo-50',
            'dark:data-checked:bg-indigo-600 dark:data-checked:text-indigo-50',
          )}
        >
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
