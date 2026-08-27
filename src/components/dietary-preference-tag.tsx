export const DIETARY_TAG_CLASSES =
  'inline-flex items-center border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 text-xs rounded px-2 py-0.5'

type DietaryPreferenceTagProps = {
  label: string
}

/** Small tag displaying a single dietary preference label */
export function DietaryPreferenceTag({ label }: DietaryPreferenceTagProps) {
  return <span className={DIETARY_TAG_CLASSES}>{label}</span>
}
