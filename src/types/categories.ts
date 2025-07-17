import * as v from 'valibot'

export const CategorySchema = v.object({
  created_at: v.string(),
  emoji: v.string(),
  id: v.number(),
  slug: v.string(),
  title: v.string(),
})

export type Category = v.InferOutput<typeof CategorySchema>
