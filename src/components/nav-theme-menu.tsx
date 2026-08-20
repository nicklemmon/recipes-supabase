import { useEffect, useRef, useState } from 'react'
import { Menu } from '@base-ui/react/menu'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { THEME_OPTIONS } from '../types/theme'
import { isThemePreference, type ThemePreference } from '../helpers/theme'
import { cn } from '../helpers/dom'
import { useTheme } from '../hooks/use-theme'
import { SrOnly } from './sr-only'
import { NAV_ICON_SIZE, NavButton } from './nav-actions'

const ICON_TRANSFORM_MS = 1000

const THEME_ICONS = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const

/** Header menu for choosing system, light, or dark theme */
export function NavThemeMenu() {
  const { theme, setTheme } = useTheme()

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <NavButton className="leading-none">
            <ThemeTriggerIcon theme={theme} />
            <SrOnly>Theme</SrOnly>
          </NavButton>
        }
      />

      <Menu.Portal>
        <Menu.Positioner className="outline-hidden" sideOffset={8} align="end">
          <Menu.Popup className="origin-[var(--transform-origin)] min-w-36 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-1 shadow-md outline-hidden transition-[scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Menu.RadioGroup
              value={theme}
              onValueChange={(value) => {
                if (!isThemePreference(value)) return
                setTheme(value)
              }}
            >
              {THEME_OPTIONS.map((option) => {
                const Icon = THEME_ICONS[option.value]

                return (
                  <Menu.RadioItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    className="grid cursor-pointer grid-cols-[1rem_1rem_1fr] items-center gap-1.5 px-2 py-1 text-sm text-slate-700 dark:text-zinc-50 outline-hidden select-none data-highlighted:bg-indigo-50 dark:data-highlighted:bg-indigo-900/40"
                  >
                    <Menu.RadioItemIndicator className="col-start-1 text-indigo-600 dark:text-indigo-400">
                      <Check size={12} />
                    </Menu.RadioItemIndicator>
                    <Icon size={14} className="col-start-2" aria-hidden />
                    <span className="col-start-3">{option.label}</span>
                  </Menu.RadioItem>
                )
              })}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

/** Slides the current header icon out and the new one in */
function ThemeTriggerIcon({ theme }: { theme: ThemePreference }) {
  const previousTheme = useRef(theme)
  const [exiting, setExiting] = useState<ThemePreference | null>(null)

  useEffect(() => {
    if (previousTheme.current === theme) return

    const leaving = previousTheme.current
    previousTheme.current = theme

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setExiting(null)
      return
    }

    setExiting(leaving)
    const timeoutId = window.setTimeout(() => setExiting(null), ICON_TRANSFORM_MS)
    return () => window.clearTimeout(timeoutId)
  }, [theme])

  return (
    <span
      className="inline-block size-4 shrink-0 overflow-hidden align-middle leading-none"
      aria-hidden
    >
      <span className="grid size-4 place-items-center">
        {THEME_OPTIONS.map((option) => {
          const Icon = THEME_ICONS[option.value]
          const isActive = theme === option.value
          const isExiting = exiting === option.value

          return (
            <Icon
              key={option.value}
              size={NAV_ICON_SIZE}
              className={cn(
                'col-start-1 row-start-1 block size-4',
                isActive || isExiting
                  ? 'motion-safe:[transition-property:opacity,transform] motion-safe:[transition-duration:200ms,1000ms] motion-safe:[transition-timing-function:ease-out,ease-in-out]'
                  : 'transition-none',
                isActive && 'translate-y-0 opacity-100',
                isExiting && '-translate-y-full opacity-40',
                !isActive && !isExiting && 'translate-y-full opacity-40',
              )}
            />
          )
        })}
      </span>
    </span>
  )
}
