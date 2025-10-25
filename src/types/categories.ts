import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  emoji: z.string(),
  slug: z.string(),
})

export type Category = z.infer<typeof CategorySchema>
