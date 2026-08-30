import { queryOptions } from '@tanstack/react-query'
import { getCategories, getCategoryBySlug } from '../api/categories'

const CATALOG_STALE_MS = 5 * 60_000

export const categoriesQueryOptions = queryOptions({
  queryKey: ['categories'] as const,
  queryFn: getCategories,
  staleTime: CATALOG_STALE_MS,
})

export function categoryBySlugQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ['categories', 'slug', slug] as const,
    queryFn: () => getCategoryBySlug(slug),
    staleTime: CATALOG_STALE_MS,
  })
}
