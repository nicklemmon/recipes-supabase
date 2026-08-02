import { cn } from '../helpers/dom'
import { SrOnly } from './sr-only'

/** Placeholder shown in a table cell when there's no value */
export function EmptyCell({
  label = 'None',
  className,
  ...props
}: React.ComponentProps<'span'> & { label?: string }) {
  return (
    <span className={cn('text-slate-400 dark:text-zinc-500', className)} {...props}>
      <span aria-hidden="true">&mdash;</span>
      <SrOnly>{label}</SrOnly>
    </span>
  )
}
