import { z } from 'zod'

export const SubcategorySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  slug: z.string(),
  emoji: z.string(),
  category_id: z.number(),
})

export type SubCategory = z.infer<typeof SubcategorySchema>
