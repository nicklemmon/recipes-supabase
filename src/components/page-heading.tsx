import { cn } from '../helpers/dom'

export function PageHeading({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1 className={cn('text-3xl md:text-5xl font-bold text-slate-700', className)} {...props} />
  )
}
