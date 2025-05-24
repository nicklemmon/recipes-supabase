import { Link, Outlet, createRootRoute, useRouteContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { LogIn, LogOut, Plus, Search, User } from 'lucide-react'
import { Toaster } from 'sonner'
import { Container } from '../components/container'
import { Inline } from '../components/inline'
import { supabase } from '../constants/supabase'
import '../styles.css'
import { SrOnly } from '../components/sr-only'

const NAV_ICON_SIZE = 19

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
              Lemfamy Recipes
            </Link>

            <Inline spacing="lg">
              {authed ? (
                <>
                  <Link to="/recipes/add" className="font-medium">
                    <Plus size={NAV_ICON_SIZE} />
                    <SrOnly>Add recipe</SrOnly>
                  </Link>

                  <button>
                    <Search size={NAV_ICON_SIZE} />
                    <SrOnly>Search</SrOnly>
                  </button>

                  <Link to="/profile" className="font-medium">
                    <User size={NAV_ICON_SIZE} />

                    <SrOnly>Profile</SrOnly>
                  </Link>

                  <Link to="/logout" className="font-medium" preload={false}>
                    <LogOut size={NAV_ICON_SIZE} />
                    <SrOnly>Log out</SrOnly>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-medium">
                    <LogIn size={NAV_ICON_SIZE} />
                    <SrOnly>Log in</SrOnly>
                  </Link>

                  <button>
                    <Search size={NAV_ICON_SIZE} />
                    <SrOnly>Search</SrOnly>
                  </button>
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
