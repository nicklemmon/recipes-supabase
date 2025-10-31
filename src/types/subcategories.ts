import { z } from 'zod'

export const SubcategorySchema = z.object({
  category_id: z.number(),
  created_at: z.string(),
  emoji: z.string(),
  id: z.number(),
  slug: z.string(),
  title: z.string(),
})

export type SubCategory = z.infer<typeof SubcategorySchema>
