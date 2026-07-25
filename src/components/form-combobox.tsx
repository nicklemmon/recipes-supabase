import * as React from 'react'
import { Combobox } from '@base-ui/react/combobox'
import { Check, X } from 'lucide-react'
import { DIETARY_TAG_CLASSES } from './dietary-preference-tag'

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
                  <Combobox.Chip key={option.value} className={`${DIETARY_TAG_CLASSES} gap-1`}>
                    {option.label}
                    <Combobox.ChipRemove
                      aria-label={`Remove ${option.label}`}
                      className="hover:text-indigo-500 leading-none"
                    >
                      <X size={12} aria-hidden />
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
                      <Check size={12} />
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
