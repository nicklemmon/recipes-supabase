import { HeadContent, Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { LogIn, LogOut, Plus, Search, User } from 'lucide-react'
import { Toaster } from 'sonner'
import { cn, title } from '../helpers/dom'
import { Container } from '../components/container'
import { Inline } from '../components/inline'
import { supabase } from '../constants/supabase'
import { SrOnly } from '../components/sr-only'
import '../styles.css'

const NAV_ICON_SIZE = 16

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: title(),
      },
    ],
  }),
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
      <HeadContent />

      <header className="py-2 flex gap-2 bg-slate-800 text-slate-300 text-sm">
        <Container>
          <div className="flex justify-between items-center gap-4">
            <Link to="/" className="font-semibold text-slate-100">
              Lemfamy Recipes
            </Link>

            <Inline spacing="sm">
              {authed ? (
                <>
                  <NavLink to="/recipes/add">
                    <Plus size={NAV_ICON_SIZE} />
                    <SrOnly>Add recipe</SrOnly>
                  </NavLink>

                  <NavLink role="button">
                    <Search size={NAV_ICON_SIZE} />
                    <SrOnly>Search</SrOnly>
                  </NavLink>

                  <NavLink to="/profile">
                    <User size={NAV_ICON_SIZE} />

                    <SrOnly>Profile</SrOnly>
                  </NavLink>

                  <NavLink to="/logout" preload={false}>
                    <LogOut size={NAV_ICON_SIZE} />
                    <SrOnly>Log out</SrOnly>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/login">
                    <LogIn size={NAV_ICON_SIZE} />
                    <SrOnly>Log in</SrOnly>
                  </NavLink>

                  <NavLink role="button">
                    <Search size={NAV_ICON_SIZE} />
                    <SrOnly>Search</SrOnly>
                  </NavLink>
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

function NavLink({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'font-medium text-slate-50 cursor-pointer rounded-lg p-2 bg-slate-900',
        'bg-slate-800',
        'hover:bg-slate-900 transition-colors',
        className,
      )}
      {...props}
    />
  )
}
