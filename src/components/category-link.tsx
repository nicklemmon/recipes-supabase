import { Link, type LinkProps } from '@tanstack/react-router'
import { cn } from '../helpers/dom'

/** Styled link card for a recipe category */
export function CategoryLink({ className, ...props }: { className?: string } & LinkProps<'a'>) {
  return (
    <Link
      className={cn(
        [
          'h-42 w-full inline-flex justify-center items-center rounded-4xl font-semibold',
          'bg-gradient-to-b from-white to-white dark:from-zinc-800 dark:to-zinc-800',
          'text-indigo-500 dark:text-indigo-400',
          'border border-indigo-200 dark:border-zinc-700',
          'shadow-lg shadow-indigo-100/50 dark:shadow-zinc-950/30',
          // Hover and keyboard focus share one surface treatment so both inputs
          // get the same affordance
          'hover:from-white hover:to-indigo-50 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-200/60',
          'dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:hover:border-zinc-600 dark:hover:shadow-zinc-950/50',
          'focus-visible:to-indigo-50 focus-visible:border-indigo-300',
          'dark:focus-visible:to-zinc-700 dark:focus-visible:border-zinc-600',
          'motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0',
          'active:to-indigo-100 active:shadow-md dark:active:to-zinc-600',
          'focus:outline-0 focus-visible:inset-ring-4 inset-ring-indigo-700 dark:inset-ring-indigo-500',
          'transition duration-200 ease-out',
        ],
        className,
      )}
      {...props}
    />
  )
}
