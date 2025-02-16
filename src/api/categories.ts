import { supabase } from '../constants/supabase'

export const CATEGORIES_TABLE_ID = 'categories'

/** Retrieves all available recipe categories */
export async function getCategories() {
  const res = await supabase.from(CATEGORIES_TABLE_ID).select().throwOnError()

  return res.data
}
