import type { HTMLProps } from 'react'
import type { SpacingProp } from '../types/props'
import { cn } from '../helpers/dom'

type AlignProp = 'top' | 'center' | 'bottom'

type InlineProps = {
  align?: AlignProp
  children: React.ReactNode
  className?: string
  spacing?: SpacingProp
} & HTMLProps<HTMLDivElement>

type InlineClassMap = {
  align: Required<Record<AlignProp, string>>
  spacing: Required<Record<SpacingProp, string>>
}

const INLINE_CLASS_MAP: InlineClassMap = {
  align: {
    bottom: 'items-end',
    center: 'items-center',
    top: 'items-start',
  },
  spacing: {
    '0': 'gap-0',
    lg: 'gap-8',
    md: 'gap-4',
    sm: 'gap-2',
    xl: 'gap-16',
    xs: 'gap-1',
  },
}

/** Arrange child elements horizontally in a row (with wrapping) */
export function Inline({
  align = 'center',
  children,
  className,
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
