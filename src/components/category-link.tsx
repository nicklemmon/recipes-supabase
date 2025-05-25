import { Link, LinkProps } from '@tanstack/react-router'
import { cn } from '../helpers/dom'

export function CategoryLink({ className, ...props }: { className?: string } & LinkProps<'a'>) {
  return (
    <Link
      className={cn(
        'h-42 w-full justify-center items-center bg-gradient-to-b to-white from-white hover:from-white hover:to-indigo-50 text-indigo-500 shadow-lg shadow-indigo-100/50 border border-indigo-200 focus-visible:inset-ring-4 inset-ring-indigo-700 inline-flex rounded-3xl font-semibold transition',
        className,
      )}
      {...props}
    />
  )
}
