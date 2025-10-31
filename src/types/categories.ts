import { z } from 'zod'

export const CategorySchema = z.object({
  created_at: z.string(),
  emoji: z.string(),
  id: z.number(),
  slug: z.string(),
  title: z.string(),
})

export type Category = z.infer<typeof CategorySchema>
