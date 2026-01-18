import { Tooltip } from '@base-ui-components/react/tooltip'

export function NavTooltip({ children }: { children: React.ReactNode }) {
  return <Tooltip.Root>{children}</Tooltip.Root>
}

export function NavTooltipTrigger({
  as,
}: {
  as: React.ComponentProps<typeof Tooltip.Trigger>['render']
}) {
  return (
    <Tooltip.Trigger render={as} className="flex size-8 items-center justify-center select-none" />
  )
}

export function NavTooltipBody({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={10}>
        <Tooltip.Popup className="flex origin-[var(--transform-origin)] flex-col rounded-md bg-slate-900 dark:bg-zinc-800 text-slate-50 dark:text-zinc-50 px-2 py-1 text-xs shadow-lg transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
          <Tooltip.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
            <ArrowSvg />
          </Tooltip.Arrow>
          {children}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  )
}

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-slate-900 dark:fill-zinc-800"
      />
    </svg>
  )
}
