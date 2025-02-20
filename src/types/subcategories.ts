import * as v from 'valibot'

export const SubcategorySchema = v.object({
  id: v.number(),
  created_at: v.string(),
  title: v.string(),
  slug: v.string(),
  emoji: v.string(),
  category_id: v.number(),
})

export type SubCategory = v.InferOutput<typeof SubcategorySchema>
