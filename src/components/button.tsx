import { LoaderCircle } from 'lucide-react'
import { cn } from '../helpers/dom'
import { cva } from 'cva'

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
          'dark:bg-indigo-700',
          'text-indigo-50',
          'dark:text-indigo-100',
          'hover:bg-indigo-700',
          'dark:hover:bg-indigo-800',
          'focus-visible:ring-indigo-400',
          'dark:focus-visible:ring-indigo-500',
        ],
        secondary: [
          'bg-indigo-100',
          'dark:bg-indigo-900',
          'text-indigo-600',
          'dark:text-indigo-200',
          'hover:bg-indigo-200',
          'dark:hover:bg-indigo-800',
          'focus-visible:ring-indigo-400',
          'dark:focus-visible:ring-indigo-500',
        ],
        destructive: [
          'bg-red-100',
          'dark:bg-red-900',
          'text-red-600',
          'dark:text-red-200',
          'hover:bg-red-200',
          'dark:hover:bg-red-800',
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
  children,
  ...props
}: React.ComponentProps<'button'> & {
  size?: ButtonSize
  variant?: ButtonVariant
  loading?: boolean
}) {
  return (
    <button
      className={cn(buttonClasses({ disabled, loading, size, variant }), className)}
      disabled={disabled}
      {...props}
    >
      {loading ? (
        <span className="absolute top-[50%] left-[50%] translate-[-50%] animate-spin">
          <LoaderCircle />
        </span>
      ) : null}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  )
}
