import * as React from 'react'
import { Combobox } from '@base-ui/react/combobox'

type Option = { label: string; value: string }

type FormComboboxProps = {
  options: Option[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
}

export function FormCombobox({ options, value, onValueChange, placeholder }: FormComboboxProps) {
  const anchorRef = React.useRef<HTMLDivElement>(null)

  const selectedOptions = value
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is Option => o !== undefined)

  const handleValueChange = (newValue: Option[]) => {
    onValueChange(newValue.map((o) => o.value))
  }

  return (
    <div ref={anchorRef} className="w-full">
    <Combobox.Root
      items={options}
      multiple
      value={selectedOptions}
      onValueChange={handleValueChange}
      isItemEqualToValue={(item, selected) => item.value === selected.value}
    >
      <Combobox.Chips className="flex flex-wrap gap-1 w-full min-h-10 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 px-2 py-1.5 rounded-lg focus-within:outline-none focus-within:ring-2 ring-indigo-700 dark:ring-indigo-500 transition">
        <Combobox.Value>
          {(selectedValues: Option[]) => (
            <React.Fragment>
              {selectedValues.map((option) => (
                <Combobox.Chip
                  key={option.value}
                  className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded px-2 py-0.5"
                >
                  {option.label}
                  <Combobox.ChipRemove
                    aria-label={`Remove ${option.label}`}
                    className="hover:text-indigo-500 leading-none"
                  >
                    <XIcon />
                  </Combobox.ChipRemove>
                </Combobox.Chip>
              ))}
              <Combobox.Input
                className="flex-1 min-w-20 bg-transparent text-sm text-slate-700 dark:text-zinc-50 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                placeholder={selectedValues.length > 0 ? '' : placeholder}
              />
            </React.Fragment>
          )}
        </Combobox.Value>
      </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} anchor={anchorRef}>
          <Combobox.Popup className="z-50 w-[var(--anchor-width)] min-w-48 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-md p-1">
            <Combobox.Empty className="px-3 py-2 text-sm text-slate-500 dark:text-zinc-400 [&:empty]:hidden">
              No options found.
            </Combobox.Empty>
            <Combobox.List>
              {(option: Option) => (
                <Combobox.Item
                  key={option.value}
                  value={option}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-zinc-50 rounded cursor-pointer data-[highlighted]:bg-indigo-50 dark:data-[highlighted]:bg-indigo-900/40 data-[selected]:font-medium"
                >
                  <Combobox.ItemIndicator className="text-indigo-600 dark:text-indigo-400">
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                  {option.label}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
    </div>
  )
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}

function XIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
