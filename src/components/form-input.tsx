import type React from 'react'
import { cn } from '../helpers/dom'

export function FormInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-10 text-sm flex w-full bg-white border border-slate-300 px-4 rounded-lg text-slate-700 focus:outline-0 focus-visible:ring-2 ring-indigo-700 transition',
        className,
      )}
      {...props}
    />
  )
}
