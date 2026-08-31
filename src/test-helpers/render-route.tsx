import { act, render, type RenderResult } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
  type AnyRouter,
} from '@tanstack/react-router'
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { routeTree } from '../route-tree.gen'
import { ThemeProvider } from '../hooks/use-theme'
import { createAppQueryClient } from '../queries/query-client'

type RenderRouteResult = RenderResult & { router: AnyRouter; queryClient: QueryClient }

/**
 * Mounts the real app route tree at a memory-history path so loaders and
 * navigation run against MSW the same way they do in the browser.
 */
export async function renderRoute(path: string): Promise<RenderRouteResult> {
  const queryClient = createAppQueryClient()
  const history = createMemoryHistory({ initialEntries: [path] })
  const router = createRouter({
    routeTree,
    history,
    defaultPendingMs: 0,
    defaultPreloadStaleTime: 0,
    context: {
      queryClient,
    },
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })

  let result!: RenderResult

  await act(async () => {
    result = render(
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>,
    )
    await router.load()
  })

  return { ...result, router, queryClient }
}
