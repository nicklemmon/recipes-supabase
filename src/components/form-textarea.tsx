import type React from 'react'
import { cn } from '../helpers/dom'

export function FormTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'text-sm flex w-full bg-white border border-slate-300 px-4 py-2 rounded-lg text-slate-700 focus:outline-0 focus-visible:ring-2 ring-indigo-700 transition',
        className,
      )}
      {...props}
    />
  )
}
