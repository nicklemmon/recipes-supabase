import { z } from 'zod'

export const RecipeRatingSchema = z.number().min(0).max(5)

export const RecipeSchema = z.object({
  category_id: z.number(),
  created_at: z.string(),
  dietary_pref: z.array(z.string()),
  directions_md: z.string(),
  id: z.number(),
  ingredients_md: z.string(),
  rating: RecipeRatingSchema,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  source: z.string().optional(),
  subcategory_id: z.number(),
  title: z.string(),
})

export const NewRecipeSchema = RecipeSchema.omit({ created_at: true, id: true })

export type NewRecipe = z.infer<typeof NewRecipeSchema>

export type Recipe = z.infer<typeof RecipeSchema>
