import { LoaderCircle } from 'lucide-react'
import { cn } from '../helpers/dom'
import { cva } from 'cva'
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

type ButtonSize = 'sm' | 'md'

const buttonClasses = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'h-8',
    'px-3',
    'py-2',
    'rounded-xl',
    'focus-visible:ring-3',
    'focus:outline-0',
    'font-semibold',
    'text-sm',
    'cursor-pointer',
    'transition',
    'relative',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-indigo-600',
          'dark:bg-indigo-600',
          'text-indigo-50',
          'dark:text-indigo-50',
          'hover:bg-indigo-700',
          'dark:hover:bg-indigo-700',
          'focus-visible:ring-indigo-400',
          'dark:focus-visible:ring-indigo-500',
        ],
        secondary: [
          'bg-indigo-100',
          'dark:bg-zinc-800',
          'text-indigo-600',
          'dark:text-indigo-300',
          'hover:bg-indigo-200',
          'dark:hover:bg-zinc-800',
          'focus-visible:ring-indigo-400',
          'dark:focus-visible:ring-indigo-500',
        ],
        destructive: [
          'bg-red-100',
          'dark:bg-red-600',
          'text-red-600',
          'dark:text-white',
          'hover:bg-red-200',
          'dark:hover:bg-red-700',
          'focus-visible:ring-red-400',
          'dark:focus-visible:ring-red-500',
        ],
      },
      size: {
        sm: ['text-sm'],
        md: [],
      },
      loading: {
        false: null,
        true: ['cursor-wait', 'opacity-75'],
      },
      disabled: {
        false: null,
        true: ['opacity-50', 'cursor-not-allowed'],
      },
    },
  },
)

/** Primary button with variant, size, and loading states */
export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  asChild,
  children,
  onClick,
  ...props
}: React.ComponentProps<'button'> & {
  size?: ButtonSize
  variant?: ButtonVariant
  loading?: boolean
  asChild?: boolean
}) {
  const content = (
    <>
      {loading ? (
        <span className="absolute top-[50%] left-[50%] translate-[-50%] animate-spin">
          <LoaderCircle />
        </span>
      ) : null}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </>
  )

  if (asChild) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child = React.Children.only(children) as React.ReactElement<any>

    return React.cloneElement(child, {
      ...(props as Record<string, unknown>),
      onClick,
      ...(child.props as Record<string, unknown>),
      className: cn(
        buttonClasses({ disabled, loading, size, variant }),
        className,
        child.props?.className,
      ),
    })
  }

  return (
    <button
      className={cn(buttonClasses({ disabled, loading, size, variant }), className)}
      disabled={disabled}
      // Stay focusable while loading (a disabled button drops focus), but block clicks and
      // submits so a form cannot be sent twice
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (loading) {
          e.preventDefault()
          return
        }

        onClick?.(e)
      }}
      {...props}
    >
      {content}
    </button>
  )
}
