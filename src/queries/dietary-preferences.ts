import { queryOptions } from '@tanstack/react-query'
import { getDietaryPreferences } from '../api/dietary-preferences'

const CATALOG_STALE_MS = 5 * 60_000

export const dietaryPreferencesQueryOptions = queryOptions({
  queryKey: ['dietary-preferences'] as const,
  queryFn: getDietaryPreferences,
  staleTime: CATALOG_STALE_MS,
})
