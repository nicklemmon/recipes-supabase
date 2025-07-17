import { createRouter, RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from './components/error-boundary'
import { routeTree } from './routeTree.gen'

// Set up a Router instance
const router = createRouter({
  context: {
    session: undefined,
    user: undefined,
  },
  defaultPreload: 'intent',
  routeTree,
})

// Register things for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>,
  )
}
