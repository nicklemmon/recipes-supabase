import { z } from 'zod'

import { supabase } from '../constants/supabase'
import { type NewRecipe, Recipe, RecipeSchema } from '../types/recipes'

const RECIPES_TABLE_ID = 'recipes'

/** Adds a recipe */
export async function addRecipe(recipe: NewRecipe) {
  return await supabase.from(RECIPES_TABLE_ID).insert([recipe]).select().throwOnError()
}

/** Deletes a single recipe */
export async function deleteRecipe(id: Recipe['id']) {
  return await supabase.from(RECIPES_TABLE_ID).delete().eq('id', id).throwOnError()
}

/** Returns a single recipe by its id */
export async function getRecipe(id: number) {
  const res = await supabase.from(RECIPES_TABLE_ID).select('*').eq('id', id).single().throwOnError()

  return RecipeSchema.parse(res.data)
}

/** Returns a single recipe by its slug, category ID, and subcategory ID */
export async function getRecipeBySlug({
  categoryId,
  slug,
  subcategoryId,
}: {
  categoryId: number
  slug: string
  subcategoryId: number
}) {
  const res = await supabase
    .from(RECIPES_TABLE_ID)
    .select('*')
    .eq('category_id', categoryId)
    .eq('subcategory_id', subcategoryId)
    .eq('slug', slug)
    .single()
    .throwOnError()

  return RecipeSchema.parse(res.data)
}

/** Returns all recipes, optionally by category and subcategory */
export async function getRecipes({
  categoryId,
  onlyFavorites,
  subcategoryId,
  titleSearch,
}: {
  categoryId?: number
  onlyFavorites?: boolean
  subcategoryId?: number
  titleSearch?: string
} = {}) {
  const query = supabase.from(RECIPES_TABLE_ID).select()

  if (categoryId && subcategoryId) {
    query.eq('category_id', categoryId).eq('subcategory_id', subcategoryId)
  }

  if (titleSearch) {
    query.ilike('title', `%${titleSearch}%`)
  }

  if (onlyFavorites) {
    query.eq('rating', 5)
  }

  query.select('*').throwOnError()

  const res = await query

  return z.array(RecipeSchema).parse(res.data)
}

/** Updates a recipe */
export async function updateRecipe(recipe: Partial<Recipe>) {
  const { id } = recipe

  if (!id) throw Error(`No "id" provided in updated recipe`)

  return await supabase.from(RECIPES_TABLE_ID).update(recipe).eq('id', id).single().throwOnError()
}
