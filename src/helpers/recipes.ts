import { Category } from '../types/categories'
import { Recipe } from '../types/recipes'
import { SubCategory } from '../types/subcategories'

export type RecipeRouteParams = {
  category: string
  subcategory: string
  recipe: string
}

/**
 * Builds the URL params the recipe view route needs, by looking up the slugs of the recipe's
 * category and subcategory.
 *
 * Returns `undefined` when either lookup fails, so callers can skip navigating instead of sending
 * someone to a broken URL.
 */
export function toRecipeRouteParams({
  recipe,
  categories,
  subcategories,
}: {
  recipe: Pick<Recipe, 'slug' | 'category_id' | 'subcategory_id'>
  categories: Category[]
  subcategories: SubCategory[]
}): RecipeRouteParams | undefined {
  const category = categories.find((category) => category.id === recipe.category_id)
  const subcategory = subcategories.find((subcategory) => subcategory.id === recipe.subcategory_id)

  if (!category || !subcategory) return undefined

  return {
    category: category.slug,
    subcategory: subcategory.slug,
    recipe: recipe.slug,
  }
}
