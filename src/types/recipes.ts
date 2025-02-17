import * as v from 'valibot'

export const RecipeSchema = v.object({
  id: v.number(),
  created_at: v.string(),
  title: v.string(),
  source: v.optional(v.string()),
  category_id: v.number(),
  subcategory_id: v.number(),
  ingredients_md: v.string(),
  dietary_pref: v.array(v.string()),
  rating: v.pipe(v.number(), v.minValue(0), v.maxValue(5)),
  directions_md: v.string(),
  slug: v.string(),
})

export type Recipe = v.InferOutput<typeof RecipeSchema>
