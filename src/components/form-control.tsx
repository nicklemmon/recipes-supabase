import type React from 'react'
import { cn } from '../helpers/dom'

/** Vertical wrapper grouping a form label and its input */
export function FormControl({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('w-full flex gap-1 flex-col', className)} {...props} />
}
