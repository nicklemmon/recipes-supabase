import type React from 'react'
import { cn } from '../helpers/dom'

export function FormLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn('flex text-sm font-semibold text-slate-900 dark:text-zinc-50', className)}
      {...props}
    />
  )
}
