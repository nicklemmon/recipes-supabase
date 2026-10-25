import { Tooltip } from '@base-ui/react/tooltip'
import { useId } from 'react'
import { NavTooltipBody } from './nav-tooltip'
import { DietaryPreferenceTag } from './dietary-preference-tag'

/** Shows up to two dietary preference tags and a count for the rest. */
export function DietaryPreferenceSummary({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null

  const visibleLabels = labels.slice(0, 2)
  const hiddenCount = labels.length - visibleLabels.length

  const tags = (
    <>
      {visibleLabels.map((label) => (
        <DietaryPreferenceTag key={label} label={label} className="shrink-0 px-1.5 text-[11px]" />
      ))}
      {hiddenCount > 0 && (
        <DietaryPreferenceTag
          label={`+${hiddenCount}`}
          className="shrink-0 bg-zinc-100 px-1.5 text-[11px] dark:bg-zinc-700"
        />
      )}
    </>
  )

  if (hiddenCount === 0) {
    return <div className="flex min-w-0 flex-nowrap gap-1 overflow-hidden">{tags}</div>
  }

  return (
    <DietaryPreferenceSummaryTooltip labels={labels.slice(visibleLabels.length)}>
      {tags}
    </DietaryPreferenceSummaryTooltip>
  )
}

function DietaryPreferenceSummaryTooltip({
  labels,
  children,
}: {
  labels: string[]
  children: React.ReactNode
}) {
  const tooltipId = useId()

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-describedby={tooltipId}
        render={
          <span
            className="flex min-w-0 max-w-full flex-nowrap items-center gap-1 overflow-hidden rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
            tabIndex={0}
          >
            {children}
          </span>
        }
      />
      <NavTooltipBody id={tooltipId}>{labels.join(', ')}</NavTooltipBody>
    </Tooltip.Root>
  )
}
