import * as v from 'valibot'

export const RecipeRatingSchema = v.pipe(v.number(), v.minValue(0), v.maxValue(5))

export const RecipeSchema = v.object({
  category_id: v.number(),
  created_at: v.string(),
  dietary_pref: v.array(v.string()),
  directions_md: v.string(),
  id: v.number(),
  ingredients_md: v.string(),
  rating: RecipeRatingSchema,
  slug: v.pipe(v.string(), v.slug()),
  source: v.optional(v.string()),
  subcategory_id: v.number(),
  title: v.string(),
})

export const NewRecipeSchema = v.omit(RecipeSchema, ['id', 'created_at'])

export type Recipe = v.InferOutput<typeof RecipeSchema>

export type NewRecipe = v.InferOutput<typeof NewRecipeSchema>
