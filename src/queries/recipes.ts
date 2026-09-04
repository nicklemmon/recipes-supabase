import { queryOptions } from '@tanstack/react-query'
import { getRecipeBySlug, getRecipes } from '../api/recipes'

const RECIPE_STALE_MS = 30_000

export type RecipesFilters = {
  categoryId?: number
  subcategoryId?: number
  titleSearch?: string
  onlyFavorites?: boolean
}

export function recipesQueryOptions(filters: RecipesFilters = {}) {
  return queryOptions({
    queryKey: ['recipes', filters] as const,
    queryFn: () => getRecipes(filters),
    staleTime: RECIPE_STALE_MS,
  })
}

export function recipeBySlugQueryOptions({
  categoryId,
  subcategoryId,
  slug,
}: {
  categoryId: number
  subcategoryId: number
  slug: string
}) {
  return queryOptions({
    queryKey: ['recipes', 'slug', { categoryId, subcategoryId, slug }] as const,
    queryFn: () => getRecipeBySlug({ slug, categoryId, subcategoryId }),
    staleTime: RECIPE_STALE_MS,
  })
}
