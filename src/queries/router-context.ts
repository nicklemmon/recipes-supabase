import type { QueryClient } from '@tanstack/react-query'
import type { Session, User } from '@supabase/supabase-js'

/** Router context shared with loaders (Query owns the cache). */
export type RouterContext = {
  queryClient: QueryClient
  session?: Session | null
  user?: User | null
}
