import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import '../styles.css'
import { Container } from '../components/container'
import { Inline } from '../components/inline'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <header className="py-4 flex gap-2 bg-slate-800 text-slate-300 text-sm">
        <Container>
          <div className="flex justify-between items-center gap-4">
            <Link to="/" className="font-semibold text-slate-100">
              Nick &amp; Laurie's Recipe Collection
            </Link>

            <Inline>
              <Link to="/login" className="font-medium">
                Log in
              </Link>

              <Link to="/logout" className="font-medium">
                Log out
              </Link>

              <button>Search</button>
            </Inline>
          </div>
        </Container>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Container></Container>
      </footer>

      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
