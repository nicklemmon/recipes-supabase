import { cn } from '../helpers/dom'

/** Styled h1 heading for a page */
export function PageHeading({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn('text-4xl md:text-5xl font-bold text-blue-950 dark:text-zinc-50', className)}
      {...props}
    />
  )
}
