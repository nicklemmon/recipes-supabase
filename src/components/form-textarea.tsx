import type React from 'react'
import { cn } from '../helpers/dom'

export function FormTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'text-sm flex w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 px-4 py-2 rounded-lg text-slate-700 dark:text-zinc-50 focus:outline-0 focus-visible:ring-2 ring-indigo-700 dark:ring-indigo-500 transition',
        className,
      )}
      {...props}
    />
  )
}
