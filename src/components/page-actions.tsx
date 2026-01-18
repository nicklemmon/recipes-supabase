import { Link, LinkProps } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { cva } from 'cva'
import { cn } from '../helpers/dom'
import { Button } from './button'
import { Inline } from './inline'

const pageActionClasses = cva([])

const ACTION_ICON_SIZE = 16

/** Re-usable/consistent wrapper for page actions */
export function PageActions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-end justify-between gap-2 w-full', className)} {...props} />
}

export function PageBackLink({
  className,
  children,
  ...props
}: { className?: string; children?: React.ReactNode } & LinkProps<'a'>) {
  return (
    <Button asChild variant="secondary" size="sm">
      <Link className={cn(pageActionClasses(), className)} {...props}>
        <Inline spacing="sm" align="center">
          <ArrowLeft size={ACTION_ICON_SIZE} />
          <span>{children}</span>
        </Inline>
      </Link>
    </Button>
  )
}

export function PageEditLink({
  className,
  children,
  ...props
}: { className?: string; children?: React.ReactNode } & LinkProps<'a'>) {
  return (
    <Button asChild variant="secondary">
      <Link className={cn(pageActionClasses(), className)} {...props}>
        <Inline spacing="sm" align="center">
          <span>{children}</span>
          <Pencil size={ACTION_ICON_SIZE} />
        </Inline>
      </Link>
    </Button>
  )
}

export function PageDeleteButton({
  className,
  children,
  ...props
}: { className?: string; children?: React.ReactNode } & React.ComponentProps<'button'>) {
  return (
    <Button variant="destructive" className={cn(pageActionClasses(), className)} {...props}>
      <Inline spacing="sm" align="center">
        <span>{children}</span>
        <Trash2 size={ACTION_ICON_SIZE} />
      </Inline>
    </Button>
  )
}
