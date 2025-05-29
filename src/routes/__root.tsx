import { HeadContent, Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Citrus, LogIn, LogOut, Plus, Search as SearchIcon, User } from 'lucide-react'
import { Toaster } from 'sonner'
import { Tooltip } from '@base-ui-components/react/tooltip'
import { title } from '../helpers/dom'
import { NavButton, NavLink, NAV_ICON_SIZE } from '../components/nav-actions'
import { Container } from '../components/container'
import { Inline } from '../components/inline'
import { Search } from '../components/search'
import { supabase } from '../constants/supabase'
import { SrOnly } from '../components/sr-only'
import '../styles.css'
import { NavTooltip, NavTooltipBody, NavTooltipTrigger } from '../components/nav-tooltip'

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
              <Inline spacing="xs">
                Lemfamy Recipes <Citrus size={NAV_ICON_SIZE} className="text-yellow-300" />
              </Inline>
            </Link>

            <Inline spacing="sm">
              {authed ? (
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

                  <NavTooltip>
                    <NavTooltipTrigger
                      as={
                        <Search>
                          <NavButton>
                            <SearchIcon size={NAV_ICON_SIZE} />
                            <SrOnly>Search</SrOnly>
                          </NavButton>
                        </Search>
                      }
                    />

                    <NavTooltipBody>Search</NavTooltipBody>
                  </NavTooltip>

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
              ) : (
                <Tooltip.Provider>
                  <NavLink to="/login">
                    <LogIn size={NAV_ICON_SIZE} />
                    <SrOnly>Log in</SrOnly>
                  </NavLink>

                  <Search>
                    <NavButton>
                      <SearchIcon size={NAV_ICON_SIZE} />
                      <SrOnly>Search</SrOnly>
                    </NavButton>
                  </Search>
                </Tooltip.Provider>
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
