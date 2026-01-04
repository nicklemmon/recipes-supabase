import { Link } from '@tanstack/react-router'
import { cn } from '../helpers/dom'

export const NAV_ICON_SIZE = 16

export function NavButton({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'font-medium text-slate-50 dark:text-slate-200 cursor-pointer rounded-lg p-2',
        'bg-slate-800 dark:bg-slate-700',
        'hover:bg-slate-900 dark:hover:bg-slate-600 focus-visible:outline-white transition',
        className,
      )}
      {...props}
    />
  )
}

export function NavLink({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'font-medium text-slate-50 dark:text-slate-200 cursor-pointer rounded-lg p-2',
        'bg-slate-800 dark:bg-slate-700',
        'hover:bg-slate-900 dark:hover:bg-slate-600 focus-visible:outline-white transition',
        className,
      )}
      {...props}
    />
  )
}
