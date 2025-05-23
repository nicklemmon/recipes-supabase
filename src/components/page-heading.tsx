import { cn } from '../helpers/dom'

export function PageHeading({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1 className={cn('text-4xl md:text-4xl font-bold text-slate-700', className)} {...props} />
  )
}
