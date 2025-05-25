import * as v from 'valibot'
import { supabase } from '../constants/supabase'
import { SubcategorySchema } from '../types/subcategories'

const SUBCATEGORIES_TABLE_ID = 'subcategories'

/** Returns all subcategories for a given category ID */
export async function getSubcategories(categoryId?: number) {
  if (categoryId) {
    const res = await supabase
      .from(SUBCATEGORIES_TABLE_ID)
      .select()
      .eq('category_id', categoryId)
      .select('*')
      .throwOnError()

    return v.parse(v.array(SubcategorySchema), res.data)
  }

  const res = await supabase.from(SUBCATEGORIES_TABLE_ID).select().select('*').throwOnError()

  return v.parse(v.array(SubcategorySchema), res.data)
}

/** Returns a subcategory by its slug */
export async function getSubcategoryBySlug(slug: string) {
  const res = await supabase
    .from(SUBCATEGORIES_TABLE_ID)
    .select('*')
    .eq('slug', slug)
    .single()
    .throwOnError()

  return v.parse(SubcategorySchema, res.data)
}
