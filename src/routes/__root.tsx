import { HeadContent, Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { Citrus, LogIn, LogOut, Plus, User } from 'lucide-react'
import { Toaster } from 'sonner'
import { Tooltip } from '@base-ui-components/react/tooltip'
import { NAV_ICON_SIZE, NavButton } from '../components/nav-actions'
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
    const session = await supabase.auth.getSession()
    return { session }
  },
})

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
              <NavButton asChild>
                <Link to="/recipes/add">
                  <Plus size={NAV_ICON_SIZE} />
                  <SrOnly>Add recipe</SrOnly>
                </Link>
              </NavButton>
            }
          />
          <NavTooltipBody>Add recipe</NavTooltipBody>
        </NavTooltip>

        <NavTooltip>
          <NavTooltipTrigger
            as={
              <NavButton asChild>
                <Link to="/profile">
                  <User size={NAV_ICON_SIZE} />
                  <SrOnly>Profile</SrOnly>
                </Link>
              </NavButton>
            }
          />
          <NavTooltipBody>Profile</NavTooltipBody>
        </NavTooltip>

        <NavSearch />

        <NavTooltip>
          <NavTooltipTrigger
            as={
              <NavButton asChild>
                <Link to="/logout" preload={false}>
                  <LogOut size={NAV_ICON_SIZE} />
                  <SrOnly>Log out</SrOnly>
                </Link>
              </NavButton>
            }
          />
          <NavTooltipBody>Log out</NavTooltipBody>
        </NavTooltip>
      </Tooltip.Provider>
    )
  }

  return (
    <Tooltip.Provider>
      <NavButton asChild>
        <Link to="/login">
          <LogIn size={NAV_ICON_SIZE} />
          <SrOnly>Log in</SrOnly>
        </Link>
      </NavButton>

      <NavSearch />
    </Tooltip.Provider>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="py-2 flex gap-2 bg-linear-180 to-indigo-50 from-indigo-50 dark:from-zinc-900 dark:to-zinc-900 text-slate-300 dark:text-zinc-300 text-sm">
        <Container>
          <div className="flex justify-between items-center gap-4">
            <Link to="/" className="font-semibold text-indigo-700 dark:text-indigo-50">
              <Inline spacing="xs">
                Lemfamy Recipes{' '}
                <Citrus size={NAV_ICON_SIZE} className="text-yellow-600 dark:text-yellow-400" />
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
  const { session } = Route.useLoaderData()
  const authed = Boolean(session.data.session)

  return (
    <>
      <HeadContent />

      <AppLayout>
        <NavActions authed={authed} />
      </AppLayout>

      <Toaster richColors />
    </>
  )
}
