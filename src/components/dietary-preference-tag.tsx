export const DIETARY_TAG_CLASSES =
  'inline-flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded px-2 py-0.5'

type DietaryPreferenceTagProps = {
  label: string
}

/** Small tag displaying a single dietary preference label */
export function DietaryPreferenceTag({ label }: DietaryPreferenceTagProps) {
  return <span className={DIETARY_TAG_CLASSES}>{label}</span>
}
