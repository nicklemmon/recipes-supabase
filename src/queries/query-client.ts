import {
  QueryClient,
  type DefaultError,
  type QueryKey,
  type QueryExecuteOptions,
} from '@tanstack/react-query'

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

/**
 * Loader-friendly read: return cached data when fresh, otherwise wait for a
 * refetch. Prefer this over ensureQueryData, which can return invalidated
 * cache immediately while only background-refetching.
 */
export function loadQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  options: QueryExecuteOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
) {
  return queryClient.query(options)
}
