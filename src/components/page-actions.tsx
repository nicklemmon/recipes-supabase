import { Link, LinkProps } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { cva } from 'cva'
import { cn } from '../helpers/dom'
import { Inline } from './inline'

const pageActionClasses = cva([
  'inline-flex',
  'items-center',
  'text-indigo-600',
  'dark:text-indigo-300',
  'bg-indigo-100',
  'dark:bg-zinc-800',
  'font-medium',
  'rounded-lg',
  'px-3',
  'py-1',
  'transition',
  'hover:bg-indigo-200',
  'dark:hover:bg-zinc-700',
  'text-sm',
  'cursor-pointer',
])

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
    <Link className={cn(pageActionClasses(), className)} {...props}>
      <Inline spacing="sm" align="center">
        <ArrowLeft size={ACTION_ICON_SIZE} />
        <span>{children}</span>
      </Inline>
    </Link>
  )
}

export function PageEditLink({
  className,
  children,
  ...props
}: { className?: string; children?: React.ReactNode } & LinkProps<'a'>) {
  return (
    <Link className={cn(pageActionClasses(), className)} {...props}>
      <Inline spacing="sm" align="center">
        <span>{children}</span>
        <Pencil size={ACTION_ICON_SIZE} />
      </Inline>
    </Link>
  )
}

export function PageDeleteButton({
  className,
  children,
  ...props
}: { className?: string; children?: React.ReactNode } & React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        pageActionClasses(),
        'bg-red-200 dark:bg-red-600 text-red-900 dark:text-white hover:bg-red-300 dark:hover:bg-red-700',
        className,
      )}
      {...props}
    >
      <Inline spacing="sm" align="center">
        <span>{children}</span>
        <Trash2 size={ACTION_ICON_SIZE} />
      </Inline>
    </button>
  )
}
