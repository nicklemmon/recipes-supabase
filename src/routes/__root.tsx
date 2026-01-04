import { Await, HeadContent, Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { Citrus, LogIn, LogOut, Plus, User } from 'lucide-react'
import { Toaster } from 'sonner'
import { Tooltip } from '@base-ui-components/react/tooltip'
import { NavLink, NAV_ICON_SIZE } from '../components/nav-actions'
import { Container } from '../components/container'
import { Inline } from '../components/inline'
import { NavSearch } from '../components/nav-search'
import { supabase } from '../constants/supabase'
import { SrOnly } from '../components/sr-only'
import { NavTooltip, NavTooltipBody, NavTooltipTrigger } from '../components/nav-tooltip'
import { title } from '../helpers/dom'
import '../styles.css'

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
    return { session: supabase.auth.getSession() }
  },
})

function NavActionsSkeleton() {
  return (
    <Inline spacing="sm">
      <div className="w-8 h-8 bg-slate-600 rounded-lg animate-pulse" />
      <div className="w-8 h-8 bg-slate-600 rounded-lg animate-pulse" />
      <div className="w-8 h-8 bg-slate-600 rounded-lg animate-pulse" />
      <div className="w-8 h-8 bg-slate-600 rounded-lg animate-pulse" />
    </Inline>
  )
}

type NavActionsProps = {
  authed?: boolean
}

function NavActions({ authed = true }: NavActionsProps) {
  if (authed) {
    return (
      <Tooltip.Provider>
        <NavTooltip>
          <NavTooltipTrigger
            as={
              <NavLink to="/recipes/add">
                <Plus size={NAV_ICON_SIZE} />
                <SrOnly>Add recipe</SrOnly>
              </NavLink>
            }
          />
          <NavTooltipBody>Add recipe</NavTooltipBody>
        </NavTooltip>

        <NavTooltip>
          <NavTooltipTrigger
            as={
              <NavLink to="/profile">
                <User size={NAV_ICON_SIZE} />
                <SrOnly>Profile</SrOnly>
              </NavLink>
            }
          />
          <NavTooltipBody>Profile</NavTooltipBody>
        </NavTooltip>

        <NavSearch />

        <NavTooltip>
          <NavTooltipTrigger
            as={
              <NavLink to="/logout" preload={false}>
                <LogOut size={NAV_ICON_SIZE} />
                <SrOnly>Log out</SrOnly>
              </NavLink>
            }
          />
          <NavTooltipBody>Log out</NavTooltipBody>
        </NavTooltip>
      </Tooltip.Provider>
    )
  }

  return (
    <Tooltip.Provider>
      <NavLink to="/login">
        <LogIn size={NAV_ICON_SIZE} />
        <SrOnly>Log in</SrOnly>
      </NavLink>

      <NavSearch />
    </Tooltip.Provider>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="py-2 flex gap-2 bg-slate-800 text-slate-300 text-sm">
        <Container>
          <div className="flex justify-between items-center gap-4">
            <Link to="/" className="font-semibold text-slate-100">
              <Inline spacing="xs">
                Lemfamy Recipes <Citrus size={NAV_ICON_SIZE} className="text-yellow-300" />
              </Inline>
            </Link>

            <Inline spacing="sm">{children}</Inline>
          </div>
        </Container>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Container></Container>
      </footer>
    </>
  )
}

function RootComponent() {
  const loaderData = Route.useLoaderData()

  return (
    <>
      <HeadContent />

      <Await promise={loaderData.session} fallback={<RootRouteLoader />}>
        {(session) => {
          const authed = Boolean(session.data.session)

          return (
            <AppLayout>
              <NavActions authed={authed} />
            </AppLayout>
          )
        }}
      </Await>

      <Toaster richColors />
    </>
  )
}

function RootRouteLoader() {
  return (
    <AppLayout>
      <NavActionsSkeleton />
    </AppLayout>
  )
}
