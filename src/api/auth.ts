import { supabase } from '../constants/supabase'
import type { AuthChangeEvent } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'

/** Async log in to the application */
export async function signIn({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw error

  return data
}

/** Retrieves the current user according to the current session */
export async function getUser() {
  return await supabase.auth.getUser()
}

/** Async sign out of the application */
export async function signOut() {
  return await supabase.auth.signOut()
}

/** Async sign up for the application */
export async function signUp({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) throw error

  return data
}

/** Returns the current user session */
export async function getSession() {
  return await supabase.auth.getSession()
}

/** Responds to changes in auth state */
export async function handleAuthChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void | Promise<void>,
) {
  return supabase.auth.onAuthStateChange(callback)
}
