import { Link, type LinkProps } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '../helpers/dom'

type TableLinkProps = {
  className?: string
  children: string
  /** Hide the trailing chevron below the `md` breakpoint */
  hideChevronOnMobile?: boolean
} & Omit<LinkProps<'a'>, 'children'>

/**
 * Splits off the last word so it can be wrapped together with the chevron.
 * A non-breaking space alone isn't enough to keep an inline-block icon from
 * wrapping onto its own line in Chromium/Firefox, so the icon is grouped
 * with the last word inside a `white-space: nowrap` span instead, which both
 * browsers do treat as one atomic unit.
 */
function splitLastWord(text: string) {
  const lastSpaceIndex = text.lastIndexOf(' ')

  if (lastSpaceIndex === -1) {
    return { leading: '', lastWord: text }
  }

  return { leading: text.slice(0, lastSpaceIndex + 1), lastWord: text.slice(lastSpaceIndex + 1) }
}

/**
 * Styled link for table cells. Keeps its trailing chevron from wrapping onto
 * its own line by wrapping it and the link text's last word together.
 */
export function TableLink({
  className,
  hideChevronOnMobile = false,
  children,
  ...props
}: TableLinkProps) {
  const { leading, lastWord } = splitLastWord(children)

  return (
    <Link className={cn('text-indigo-600 dark:text-indigo-400 font-medium', className)} {...props}>
      {leading}
      <span className="whitespace-nowrap">
        {lastWord}{' '}
        <ChevronRight
          size={16}
          className={cn(
            'inline-block align-middle group-hover:translate-x-1 transition-transform',
            hideChevronOnMobile && 'hidden md:inline-block',
          )}
        />
      </span>
    </Link>
  )
}
