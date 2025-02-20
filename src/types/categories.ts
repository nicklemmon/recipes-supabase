import * as v from 'valibot'

export const CategorySchema = v.object({
  id: v.number(),
  created_at: v.string(),
  title: v.string(),
  emoji: v.string(),
  slug: v.string(),
})

export type Category = v.InferOutput<typeof CategorySchema>
