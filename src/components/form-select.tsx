import { ChevronDown } from 'lucide-react'
import { cn } from '../helpers/dom'

export function FormSelect({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className={cn('relative h-10', props.disabled === true ? 'grayscale' : '', className)}>
      <select
        className={cn(
          'h-full appearance-none text-sm flex w-full bg-white border border-slate-300 px-4 rounded-lg text-slate-700 focus:outline-0 focus-visible:ring-2 ring-indigo-700 transition',
          props.disabled === true ? 'bg-slate-100 pointer-none cursor-not-allowed' : '',
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-2.5 top-[50%] translate-y-[-50%] text-slate-700"
      />
    </div>
  )
}
