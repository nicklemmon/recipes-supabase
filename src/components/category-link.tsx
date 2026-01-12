import { Link, type LinkProps } from '@tanstack/react-router'
import { cn } from '../helpers/dom'

export function CategoryLink({ className, ...props }: { className?: string } & LinkProps<'a'>) {
  return (
    <Link
      className={cn(
        'h-42 w-full justify-center items-center bg-gradient-to-b to-white from-white hover:from-white hover:to-indigo-50 dark:to-zinc-800 dark:from-zinc-800 dark:hover:from-zinc-800 dark:hover:to-zinc-700 text-indigo-500 dark:text-indigo-400 shadow-lg shadow-indigo-100/50 dark:shadow-zinc-950/30 border border-indigo-200 dark:border-zinc-700 focus-visible:inset-ring-4 inset-ring-indigo-700 dark:inset-ring-indigo-500 inline-flex rounded-4xl font-semibold transition',
        className,
      )}
      {...props}
    />
  )
}
