import type { ReactNode } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '../helpers/dom'

type TableLinkProps = {
  className?: string
  children: ReactNode
  /** Hide the trailing chevron below the `md` breakpoint */
  hideChevronOnMobile?: boolean
} & Omit<LinkProps<'a'>, 'children'>

/**
 * Styled link for table cells. Glues its trailing chevron to the last word
 * of the link text with a non-breaking space so the chevron can't wrap onto
 * its own line.
 */
export function TableLink({
  className,
  hideChevronOnMobile = false,
  children,
  ...props
}: TableLinkProps) {
  return (
    <Link className={cn('text-indigo-600 dark:text-indigo-400 font-medium', className)} {...props}>
      {children}
      {' '}
      <ChevronRight
        size={16}
        className={cn(
          'inline-block align-middle group-hover:translate-x-1 transition-transform',
          hideChevronOnMobile && 'hidden md:inline-block',
        )}
      />
    </Link>
  )
}
