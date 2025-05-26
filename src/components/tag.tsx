import { cva } from 'cva'

type TagColorScheme = 'red' | 'yellow' | 'indigo' | 'cyan' | 'slate'

const tagClasses = cva(['rounded-xl', 'h-12', 'px-4', 'bg-slate-400', 'text-slate-800'], {
  variants: {
    colorScheme: {
      red: [],
      yellow: [],
      indigo: [],
      cyan: [],
      slate: [],
    },
  },
})

export function Tag({
  children,
  className,
  colorScheme,
  ...props
}: React.ComponentProps<'span'> & { colorScheme: TagColorScheme }) {
  return (
    <span className={tagClasses({ colorScheme })} {...props}>
      {children}
    </span>
  )
}
