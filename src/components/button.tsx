import { cn } from '../helpers/dom'

export function Button({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'h-10 bg-gradient-to-b to-indigo-600 from-indigo-500 border-2 border-indigo-600 px-5 py-2 rounded-xl focus-visible:ring-3 ring-indigo-700 focus:outline-0 font-semibold text-sm cursor-pointer text-white transition',
        className,
      )}
      {...props}
    />
  )
}
