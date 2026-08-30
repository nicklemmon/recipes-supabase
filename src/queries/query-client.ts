import { QueryClient } from '@tanstack/react-query'

/** Shared QueryClient defaults for the SPA cache. */
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  })
}
