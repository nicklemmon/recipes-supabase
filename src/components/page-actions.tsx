import { Link, LinkProps } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'

import { cva } from 'cva'

import { cn } from '../helpers/dom'

import { Inline } from './inline'

const pageActionClasses = cva([
  'inline-flex',
  'items-center',
  'text-indigo-600',
  'bg-indigo-100',
  'font-medium',
  'rounded-lg',
  'px-3',
  'py-1',
  'transition',
  'hover:bg-indigo-200',
  'text-sm',
  'cursor-pointer',
])

const ACTION_ICON_SIZE = 16

/** Re-usable/consistent wrapper for page actions */
export function PageActions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-end justify-between gap-2 w-full', className)} {...props} />
}

export function PageBackLink({
  children,
  className,
  ...props
}: { children?: React.ReactNode; className?: string } & LinkProps<'a'>) {
  return (
    <Link className={cn(pageActionClasses(), className)} {...props}>
      <Inline align="center" spacing="sm">
        <ArrowLeft size={ACTION_ICON_SIZE} />
        <span>{children}</span>
      </Inline>
    </Link>
  )
}

export function PageEditLink({
  children,
  className,
  ...props
}: { children?: React.ReactNode; className?: string } & LinkProps<'a'>) {
  return (
    <Link className={cn(pageActionClasses(), className)} {...props}>
      <Inline align="center" spacing="sm">
        <span>{children}</span>
        <Pencil size={ACTION_ICON_SIZE} />
      </Inline>
    </Link>
  )
}

export function PageDeleteButton({
  children,
  className,
  ...props
}: { children?: React.ReactNode; className?: string } & React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(pageActionClasses(), 'bg-red-200 text-red-900 hover:bg-red-300', className)}
      {...props}
    >
      <Inline align="center" spacing="sm">
        <span>{children}</span>
        <Trash2 size={ACTION_ICON_SIZE} />
      </Inline>
    </button>
  )
}
