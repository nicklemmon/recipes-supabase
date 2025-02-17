import type { HTMLProps } from 'react'
import type { SpacingProp } from '../types/props'
import { cn } from '../helpers/dom'

type AlignProp = 'left' | 'center' | 'right'

type StackProps = {
  children: React.ReactNode
  spacing?: SpacingProp
  align?: AlignProp
  className?: string
} & HTMLProps<HTMLDivElement>

type StackClassMap = {
  spacing: Required<Record<SpacingProp, string>>
  align: Required<Record<AlignProp, string>>
}

const STACK_CLASS_MAP: StackClassMap = {
  spacing: {
    0: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-8',
    xl: 'gap-16',
  },
  align: {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  },
}

/** Arrange child elements vertically in a column */
export function Stack({
  children,
  className,
  align = 'left',
  spacing = 'md',
  ...rest
}: StackProps) {
  return (
    <div
      className={cn(
        'flex flex-col w-full',
        STACK_CLASS_MAP.spacing[spacing],
        STACK_CLASS_MAP.align[align],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
