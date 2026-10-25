import { Link, type LinkProps } from '@tanstack/react-router'
import { Tooltip } from '@base-ui/react/tooltip'
import { useId } from 'react'
import { cn } from '../helpers/dom'
import { NavTooltipBody } from './nav-tooltip'

type TableLinkProps = {
  className?: string
  children: string
} & Omit<LinkProps<'a'>, 'children'>

/** Truncated recipe link that shows the full title on hover or keyboard focus. */
export function TableLink({ className, children, ...props }: TableLinkProps) {
  const tooltipId = useId()

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-describedby={tooltipId}
        render={
          <Link
            className={cn(
              'flex min-w-0 items-center text-indigo-600 dark:text-indigo-400 font-medium underline underline-offset-4',
              className,
            )}
            {...props}
          >
            <span className="min-w-0 flex-initial truncate">{children}</span>
          </Link>
        }
      />
      <NavTooltipBody id={tooltipId}>{children}</NavTooltipBody>
    </Tooltip.Root>
  )
}
