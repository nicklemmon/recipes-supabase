import { z } from 'zod'
import { supabase } from '../constants/supabase'
import { DietaryPreferenceSchema } from '../types/dietary-preferences'

const DIETARY_PREFERENCES_TABLE_ID = 'dietary_preferences'

/** Retrieves all available dietary preferences */
export async function getDietaryPreferences() {
  const res = await supabase.from(DIETARY_PREFERENCES_TABLE_ID).select().throwOnError()

  return z.array(DietaryPreferenceSchema).parse(res.data)
}
