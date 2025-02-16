import * as v from 'valibot'
import { supabase } from '../constants/supabase'
import { CategorySchema } from '../types/categories'

const CATEGORIES_TABLE_ID = 'categories'

/** Retrieves all available recipe categories */
export async function getCategories() {
  const res = await supabase.from(CATEGORIES_TABLE_ID).select().throwOnError()

  return v.parse(v.array(CategorySchema), res.data)
}

/** Returns a category by its slug */
export async function getCategoryBySlug(slug: string) {
  const res = await supabase
    .from(CATEGORIES_TABLE_ID)
    .select('*')
    .eq('slug', slug)
    .single()
    .throwOnError()

  return v.parse(CategorySchema, res.data)
}
