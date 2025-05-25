import { cn } from '../helpers/dom'

/** Constrains/centers content for consistency/alignment throughout a page layout */
export function Container({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <div className={cn('max-w-[1000px] mx-auto w-full px-4', className)}>{children}</div>
}
