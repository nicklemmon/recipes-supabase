import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  createMemoryHistory,
} from '@tanstack/react-router'

/**
 * Renders a component inside a real TanStack Router instance (memory history,
 * a splat route that matches any `to`) so components using `<Link>` render
 * as real anchors, without mocking the router.
 */
export function renderWithRouter(ui: ReactNode) {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => ui,
  })
  const catchAllRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: () => null,
  })

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, catchAllRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return render(<RouterProvider router={router} />)
}
