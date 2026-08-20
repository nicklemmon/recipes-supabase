import { Menu } from '@base-ui/react/menu'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { THEME_OPTIONS, isThemePreference } from '../helpers/theme'
import { useTheme } from '../hooks/use-theme'
import { SrOnly } from './sr-only'
import { NAV_ICON_SIZE, NavButton } from './nav-actions'

const THEME_ICONS = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const

/** Header menu for choosing system, light, or dark theme */
export function NavThemeMenu() {
  const { theme, setTheme } = useTheme()
  const TriggerIcon = THEME_ICONS[theme]

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <NavButton>
            <TriggerIcon size={NAV_ICON_SIZE} />
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
                    className="grid cursor-pointer grid-cols-[1rem_1rem_1fr] items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-zinc-50 outline-hidden select-none data-highlighted:bg-indigo-50 dark:data-highlighted:bg-indigo-900/40"
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
