import { Link, LinkProps } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../helpers/dom'
import { Inline } from './inline'

export function PageBackLink({
  className,
  children,
  ...props
}: { className?: string; children?: React.ReactNode } & LinkProps<'a'>) {
  return (
    <Link
      className={cn(
        'inline-flex items center text-indigo-600 bg-indigo-100 font-medium rounded-lg px-3 py-1 transition hover:bg-indigo-200 text-sm',
        className,
      )}
      {...props}
    >
      <Inline spacing="sm" align="center">
        <ArrowLeft size="16" />
        <span>{children}</span>
      </Inline>
    </Link>
  )
}
