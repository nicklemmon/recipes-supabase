import React from 'react'
import { cn } from '../helpers/dom'

export type FormInputProps = React.ComponentProps<'input'>

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 text-sm flex w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-0 focus-visible:ring-2 ring-indigo-700 dark:ring-indigo-500 transition',
          className,
        )}
        {...props}
      />
    )
  },
)

FormInput.displayName = 'FormInput'
