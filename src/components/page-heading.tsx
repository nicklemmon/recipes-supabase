import { cn } from '../helpers/dom'

export function PageHeading({ className, ...props }: React.ComponentProps<'h1'>) {
  return <h1 className={cn('text-5xl font-semibold text-indigo-800', className)} {...props} />
}
