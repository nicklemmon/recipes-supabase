import { Link, Outlet, createRootRoute, useRouteContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import { Container } from '../components/container'
import { Inline } from '../components/inline'
import { supabase } from '../constants/supabase'
import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
  loader: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return { session }
  },
})

function RootComponent() {
  const loaderData = Route.useLoaderData()
  const authed = Boolean(loaderData.session)

  return (
    <>
      <header className="py-4 flex gap-2 bg-slate-800 text-slate-300 text-sm">
        <Container>
          <div className="flex justify-between items-center gap-4">
            <Link to="/" className="font-semibold text-slate-100">
              Nick &amp; Laurie's Recipe Collection
            </Link>

            <Inline>
              {authed ? (
                <>
                  <Link to="/recipes/add" className="font-medium">
                    Add recipe
                  </Link>

                  <button>Search</button>

                  <Link to="/logout" className="font-medium" preload={false}>
                    Log out
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-medium">
                    Log in
                  </Link>

                  <button>Search</button>
                </>
              )}
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

      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
