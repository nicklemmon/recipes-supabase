import { cn } from '../helpers/dom'

export function PageHeading({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn('text-4xl md:text-5xl font-bold text-blue-950 dark:text-blue-100', className)}
      {...props}
    />
  )
}
