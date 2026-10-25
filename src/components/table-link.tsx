import { Link, type LinkProps } from '@tanstack/react-router'
import { Tooltip } from '@base-ui/react/tooltip'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../helpers/dom'
import { NavTooltipBody } from './nav-tooltip'

type TableLinkProps = {
  className?: string
  children: string
} & Omit<LinkProps<'a'>, 'children'>

/** Truncated recipe link that shows the full title on hover or keyboard focus. */
export function TableLink({ className, children, ...props }: TableLinkProps) {
  const tooltipId = useId()
  const titleRef = useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const titleElement = titleRef.current
    if (!titleElement) return

    const measureTruncation = () => {
      setIsTruncated(titleElement.scrollWidth > titleElement.clientWidth)
    }

    measureTruncation()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measureTruncation)
      return () => window.removeEventListener('resize', measureTruncation)
    }

    const observer = new ResizeObserver(measureTruncation)
    observer.observe(titleElement)
    return () => observer.disconnect()
  }, [children])

  const link = (
    <Link
      className={cn(
        'flex min-w-0 items-center text-indigo-600 dark:text-indigo-400 font-medium underline decoration-indigo-400/70 dark:decoration-indigo-500/70 underline-offset-4',
        className,
      )}
      aria-describedby={isTruncated ? tooltipId : undefined}
      {...props}
    >
      <span ref={titleRef} className="min-w-0 flex-initial truncate">
        {children}
      </span>
    </Link>
  )

  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={link} />
      {isTruncated && <NavTooltipBody id={tooltipId}>{children}</NavTooltipBody>}
    </Tooltip.Root>
  )
}
