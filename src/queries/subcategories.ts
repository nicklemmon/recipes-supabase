import { queryOptions } from '@tanstack/react-query'
import { getSubcategories, getSubcategoryBySlug } from '../api/subcategories'

const CATALOG_STALE_MS = 5 * 60_000

export function subcategoriesQueryOptions(categoryId?: number) {
  return queryOptions({
    queryKey:
      categoryId == null
        ? (['subcategories'] as const)
        : (['subcategories', { categoryId }] as const),
    queryFn: () => getSubcategories(categoryId),
    staleTime: CATALOG_STALE_MS,
  })
}

export function subcategoryBySlugQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ['subcategories', 'slug', slug] as const,
    queryFn: () => getSubcategoryBySlug(slug),
    staleTime: CATALOG_STALE_MS,
  })
}
