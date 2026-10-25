import { Link, type LinkProps } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Tooltip } from '@base-ui/react/tooltip'
import { useId } from 'react'
import { cn } from '../helpers/dom'
import { NavTooltipBody } from './nav-tooltip'

type TableLinkProps = {
  className?: string
  children: string
  /** Hide the trailing chevron below the `md` breakpoint */
  hideChevronOnMobile?: boolean
} & Omit<LinkProps<'a'>, 'children'>

/** Truncated recipe link that shows the full title on hover or keyboard focus. */
export function TableLink({
  className,
  hideChevronOnMobile = false,
  children,
  ...props
}: TableLinkProps) {
  const tooltipId = useId()

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-describedby={tooltipId}
        render={
          <Link
            className={cn(
              'flex min-w-0 items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium',
              className,
            )}
            {...props}
          >
            <span className="min-w-0 flex-1 truncate">{children}</span>
            <ChevronRight
              size={16}
              aria-hidden="true"
              className={cn(
                'shrink-0 transition-transform group-hover:translate-x-1',
                hideChevronOnMobile && 'hidden md:inline-block',
              )}
            />
          </Link>
        }
      />
      <NavTooltipBody id={tooltipId}>{children}</NavTooltipBody>
    </Tooltip.Root>
  )
}
