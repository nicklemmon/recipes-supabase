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
      <header className="p-3 flex gap-2 bg-white text-indigo-900 text-md">
        <Container>
          <div className="flex justify-between items-center gap-4">
            <Link to="/">Nick &amp; Laurie's Recipe Collection</Link>

            <Inline>
              <Link to="/login">Log in</Link>

              <Link to="/logout">Log out</Link>
            </Inline>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <Outlet />
        </Container>
      </main>

      <footer>
        <Container></Container>
      </footer>

      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
