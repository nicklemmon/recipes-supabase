type DietaryPreferenceTagProps = {
  label: string
}

export function DietaryPreferenceTag({ label }: DietaryPreferenceTagProps) {
  return (
    <span className="inline-flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded px-2 py-0.5">
      {label}
    </span>
  )
}
