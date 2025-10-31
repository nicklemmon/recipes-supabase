import type { AuthChangeEvent } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '../constants/supabase'

/** Returns the current user session */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  return data
}

/** Retrieves the current user according to the current session */
export async function getUser() {
  return await supabase.auth.getUser()
}

/** Responds to changes in auth state */
export async function handleAuthChange(
  callback: (event: AuthChangeEvent, session: null | Session) => Promise<void> | void,
) {
  return supabase.auth.onAuthStateChange(callback)
}

/** Async log in to the application */
export async function signIn({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw error

  return data
}

/** Async sign out of the application */
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}

/** Async sign up for the application */
export async function signUp({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) throw error

  return data
}
