import * as v from 'valibot'

export const SubcategorySchema = v.object({
  category_id: v.number(),
  created_at: v.string(),
  emoji: v.string(),
  id: v.number(),
  slug: v.string(),
  title: v.string(),
})

export type SubCategory = v.InferOutput<typeof SubcategorySchema>
