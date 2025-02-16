import { createClient } from '@supabase/supabase-js'

const SUPABASE_PROJECT_URL = import.meta.env['VITE_SUPABASE_PROJECT_URL']

const SUPABASE_CLIENT_KEY = import.meta.env['VITE_SUPABASE_CLIENT_KEY']

if (!SUPABASE_PROJECT_URL || !SUPABASE_CLIENT_KEY) {
  throw Error(`No project URL and/or client key provided in env vars`)
}

/** Supabase client */
export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_CLIENT_KEY)
