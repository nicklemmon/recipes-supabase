import { Switch as BaseSwitch } from '@base-ui-components/react/switch'
import * as React from 'react'
import { cn } from '../helpers/dom'

export function Switch({
  className,
  defaultChecked,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      className={cn(
        'relative cursor-pointer bg-slate-400 flex h-6 w-10 rounded-full p-px  shadow-gray-200 outline outline-1 -outline-offset-1 overflow-hidden outline-slate-300 data-[checked]:outline-green-500 transition before:absolute before:rounded-full before:outline-offset-2 before:outline-indigo-800 focus-visible:before:inset-0 focus-visible:before:outline focus-visible:before:outline-2 active:bg-gray-100 data-[checked]:bg-green-400 data-[checked]:active:bg-gray-500 dark:from-gray-500 dark:shadow-black/75 dark:outline-white/15 dark:data-[checked]:shadow-none',
        className,
      )}
      defaultChecked={defaultChecked}
      {...props}
    >
      <BaseSwitch.Thumb className="aspect-square h-full rounded-full bg-white shadow-[0_0_1px_1px,0_1px_1px,1px_2px_4px_-1px] shadow-slate-500 data-[checked]:shadow-green-500 transition data-[checked]:translate-x-4 dark:shadow-black/25" />
    </BaseSwitch.Root>
  )
}
