import { z } from 'zod'

export const RecipeRatingSchema = z.number().min(0).max(5)

export const RecipeSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  source: z.string().optional(),
  category_id: z.number(),
  subcategory_id: z.number(),
  ingredients_md: z.string(),
  dietary_pref: z.array(z.string()),
  rating: RecipeRatingSchema,
  directions_md: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

export const NewRecipeSchema = RecipeSchema.omit({ id: true, created_at: true })

export type Recipe = z.infer<typeof RecipeSchema>

export type NewRecipe = z.infer<typeof NewRecipeSchema>
