import { z } from 'zod'

export const DietaryPreferenceSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  slug: z.string(),
  label: z.string(),
  category: z.string(),
  description: z.string().nullable(),
})

export type DietaryPreference = z.infer<typeof DietaryPreferenceSchema>
