import { ChevronDown } from 'lucide-react'
import { cn } from '../helpers/dom'

export function FormSelect({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className={cn('relative h-10', props.disabled === true ? 'grayscale' : '', className)}>
      <select
        className={cn(
          'h-full appearance-none text-sm flex w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 px-4 rounded-lg text-slate-700 dark:text-zinc-50 focus:outline-0 focus-visible:ring-2 ring-indigo-700 dark:ring-indigo-500 transition',
          props.disabled === true
            ? 'bg-slate-100 dark:bg-zinc-700 pointer-none cursor-not-allowed'
            : '',
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-2.5 top-[50%] translate-y-[-50%] text-indigo-500 dark:text-indigo-400"
      />
    </div>
  )
}
