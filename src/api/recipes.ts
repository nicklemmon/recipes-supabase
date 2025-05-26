import * as v from 'valibot'
import { supabase } from '../constants/supabase'
import { type NewRecipe, Recipe, RecipeSchema } from '../types/recipes'

const RECIPES_TABLE_ID = 'recipes'

/** Returns all recipes, optionally by category and subcategory */
export async function getRecipes({
  categoryId,
  subcategoryId,
}: { categoryId?: number; subcategoryId?: number } = {}) {
  let res

  if (categoryId && subcategoryId) {
    res = await supabase
      .from(RECIPES_TABLE_ID)
      .select()
      .eq('category_id', categoryId)
      .eq('subcategory_id', subcategoryId)
      .select('*')
      .throwOnError()

    return v.parse(v.array(RecipeSchema), res.data)
  }

  res = await supabase.from(RECIPES_TABLE_ID).select('*').throwOnError()

  return v.parse(v.array(RecipeSchema), res.data)
}

/** Returns a single recipe by its slug, category ID, and subcategory ID */
export async function getRecipeBySlug({
  slug,
  categoryId,
  subcategoryId,
}: {
  slug: string
  categoryId: number
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

  return v.parse(RecipeSchema, res.data)
}

/** Returns a single recipe by its id */
export async function getRecipe(id: number) {
  const res = await supabase.from(RECIPES_TABLE_ID).select('*').eq('id', id).single().throwOnError()

  return v.parse(RecipeSchema, res.data)
}

/** Adds a recipe */
export async function addRecipe(recipe: NewRecipe) {
  return await supabase.from(RECIPES_TABLE_ID).insert([recipe]).select().throwOnError()
}

/** Updates a recipe */
export async function updateRecipe(recipe: Partial<Recipe>) {
  console.log('recipe', recipe)
  const { id } = recipe

  if (!id) throw Error(`No "id" provided in updated recipe`)

  return await supabase.from(RECIPES_TABLE_ID).update(recipe).eq('id', id).single().throwOnError()
}
