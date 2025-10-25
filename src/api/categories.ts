import { z } from 'zod'
import { supabase } from '../constants/supabase'
import { CategorySchema } from '../types/categories'

const CATEGORIES_TABLE_ID = 'categories'

/** Retrieves all available recipe categories */
export async function getCategories() {
  const res = await supabase.from(CATEGORIES_TABLE_ID).select().throwOnError()

  return z.array(CategorySchema).parse(res.data)
}

/** Returns a category by its slug */
export async function getCategoryBySlug(slug: string) {
  const res = await supabase
    .from(CATEGORIES_TABLE_ID)
    .select('*')
    .eq('slug', slug)
    .single()
    .throwOnError()

  return CategorySchema.parse(res.data)
}
