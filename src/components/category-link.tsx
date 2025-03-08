import { Link, LinkProps } from '@tanstack/react-router'
import { cn } from '../helpers/dom'

export function CategoryLink({ className, ...props }: { className?: string } & LinkProps<'a'>) {
  return (
    <Link
      className={cn(
        'h-52 w-full justify-center items-center bg-gradient-to-b from-60% to-indigo-100 from-indigo-50 hover:from-indigo-100 text-indigo-600 shadow-md shadow-indigo-100/50 border border-indigo-200 p-8 focus-visible:inset-ring-4  inset-ring-indigo-700 inline-flex rounded-2xl text-md font-semibold transition',
        className,
      )}
      {...props}
    />
  )
}
