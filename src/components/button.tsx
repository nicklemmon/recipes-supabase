import { LoaderCircle } from 'lucide-react'
import { cn } from '../helpers/dom'
import { cva } from 'cva'
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

type ButtonSize = 'sm' | 'md'

const buttonClasses = cva(
  [
    'h-10',
    'px-5',
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
          'dark:bg-zinc-700',
          'text-indigo-600',
          'dark:text-indigo-300',
          'hover:bg-indigo-200',
          'dark:hover:bg-zinc-600',
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
        true: ['cursor-wait', 'pointer-none', 'opacity-75'],
      },
      disabled: {
        false: null,
        true: ['opacity-50', 'cursor-not-allowed'],
      },
    },
  },
)

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  asChild,
  children,
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
      {...props}
    >
      {content}
    </button>
  )
}
