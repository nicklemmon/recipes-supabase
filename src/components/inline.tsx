import type { HTMLProps } from 'react'
import type { SpacingProp } from '../types/props'
import { cn } from '../helpers/dom'

type AlignProp = 'top' | 'center' | 'bottom'

type InlineProps = {
  children: React.ReactNode
  spacing?: SpacingProp
  align?: AlignProp
  className?: string
} & HTMLProps<HTMLDivElement>

type InlineClassMap = {
  spacing: Required<Record<SpacingProp, string>>
  align: Required<Record<AlignProp, string>>
}

const INLINE_CLASS_MAP: InlineClassMap = {
  spacing: {
    '0': 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-8',
    xl: 'gap-16',
  },
  align: {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  },
}

/** Arrange child elements horizontally in a row (with wrapping) */
export function Inline({
  children,
  className,
  align = 'center',
  spacing = 'md',
  ...rest
}: InlineProps) {
  return (
    <div
      className={cn(
        'inline-flex flex-row flex-wrap',
        INLINE_CLASS_MAP.spacing[spacing],
        INLINE_CLASS_MAP.align[align],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
