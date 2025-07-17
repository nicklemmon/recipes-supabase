import type { HTMLProps } from 'react'

import type { SpacingProp } from '../types/props'

import { cn } from '../helpers/dom'

type AlignProp = 'left' | 'center' | 'right'

type StackProps = {
  align?: AlignProp
  children?: React.ReactNode
  className?: string
  spacing?: SpacingProp
} & HTMLProps<HTMLDivElement>

type StackClassMap = {
  align: Required<Record<AlignProp, string>>
  spacing: Required<Record<SpacingProp, string>>
}

const STACK_CLASS_MAP: StackClassMap = {
  align: {
    center: 'items-center',
    left: 'items-start',
    right: 'items-end',
  },
  spacing: {
    0: 'gap-0',
    lg: 'gap-8',
    md: 'gap-4',
    sm: 'gap-2',
    xl: 'gap-16',
    xs: 'gap-1',
  },
}

/** Arrange child elements vertically in a column */
export function Stack({
  align = 'left',
  children,
  className,
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
