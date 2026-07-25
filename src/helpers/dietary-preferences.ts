import { DietaryPreference } from '../types/dietary-preferences'

export function findDietaryPrefLabel(prefs: DietaryPreference[], slug: string): string {
  return prefs.find((p) => p.slug === slug)?.label ?? slug
}

export function toDietaryPrefOptions(
  prefs: DietaryPreference[],
): { label: string; value: string }[] {
  return prefs.map((pref) => ({ label: pref.label, value: pref.slug }))
}
