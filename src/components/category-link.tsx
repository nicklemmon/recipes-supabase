import { Link, LinkProps } from '@tanstack/react-router'
import { cn } from '../helpers/dom'

export function CategoryLink({ className, ...props }: { className?: string } & LinkProps<'a'>) {
  return (
    <Link
      className={cn(
        'h-52 w-full justify-center items-center bg-gradient-to-b to-indigo-200 from-indigo-100 hover:from-indigo-200 text-indigo-600 shadow-md shadow-indigo-100/50 border border-indigo-200 p-8 focus-visible:inset-ring-4  inset-ring-indigo-700 inline-flex rounded-2xl text-lg font-semibold transition',
        className,
      )}
      {...props}
    />
  )
}
