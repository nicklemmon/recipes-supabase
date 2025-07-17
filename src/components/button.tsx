import { LoaderCircle } from 'lucide-react'
import { cva } from 'cva'
import { cn } from '../helpers/dom'

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
      disabled: {
        false: null,
        true: ['opacity-50', 'cursor-not-allowed'],
      },
      loading: {
        false: null,
        true: ['cursor-wait', 'pointer-none', 'opacity-75'],
      },
      size: {
        md: [],
        sm: ['text-sm'],
      },
      variant: {
        destructive: [
          'bg-red-100',
          'text-red-600',
          'hover:bg-red-200',
          'focus-visible:ring-red-400',
        ],
        primary: [
          'bg-indigo-600',
          'text-indigo-50',
          'hover:bg-indigo-700',
          'focus-visible:ring-indigo-400',
        ],
        secondary: [
          'bg-indigo-100',
          'text-indigo-600',
          'hover:bg-indigo-200',
          'focus-visible:ring-indigo-400',
        ],
      },
    },
  },
)

export function Button({
  children,
  className,
  disabled,
  loading,
  size = 'md',
  variant = 'primary',
  ...props
}: React.ComponentProps<'button'> & {
  loading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
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
