import { cva } from 'cva'
import { cn } from '../helpers/dom'

type TagColorScheme = 'red' | 'yellow' | 'indigo' | 'cyan' | 'slate'

const tagClasses = cva(
  ['inline-flex', 'items-center', 'rounded-sm', 'h-6', 'px-3', 'py-1', 'text-sm', 'font-medium'],
  {
    variants: {
      colorScheme: {
        red: ['bg-red-100', 'text-red-700', 'dark:bg-red-900/50', 'dark:text-red-300'],
        yellow: [
          'bg-yellow-100',
          'text-yellow-700',
          'dark:bg-yellow-900/50',
          'dark:text-yellow-300',
        ],
        indigo: [
          'bg-indigo-100',
          'text-indigo-700',
          'dark:bg-indigo-900/50',
          'dark:text-indigo-300',
        ],
        cyan: ['bg-cyan-100', 'text-cyan-700', 'dark:bg-cyan-900/50', 'dark:text-cyan-300'],
        slate: ['bg-slate-200', 'text-slate-700', 'dark:bg-zinc-700', 'dark:text-zinc-200'],
      },
    },
    defaultVariants: {
      colorScheme: 'slate',
    },
  },
)

export function Tag({
  children,
  className,
  colorScheme = 'slate',
  ...props
}: React.ComponentProps<'span'> & { colorScheme?: TagColorScheme }) {
  return (
    <span className={cn(tagClasses({ colorScheme }), className)} {...props}>
      {children}
    </span>
  )
}
