import { cn } from '../helpers/dom'
import { Button } from './button'

export const NAV_ICON_SIZE = 16

export function NavButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="secondary"
      className={cn(
        'h-auto font-medium cursor-pointer rounded-lg p-2 shadow-md shadow-indigo-200 dark:shadow-zinc-900',
        'focus-visible:ring-0',
        className,
      )}
      {...props}
    />
  )
}
