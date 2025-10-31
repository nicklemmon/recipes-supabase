import { Tooltip } from '@base-ui-components/react/tooltip'
import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { Citrus, LogIn, LogOut, Plus, User } from 'lucide-react'
import { Toaster } from 'sonner'

import { Container } from '../components/container'
import { Inline } from '../components/inline'
import { NAV_ICON_SIZE, NavLink } from '../components/nav-actions'
import { NavSearch } from '../components/nav-search'
import { NavTooltip, NavTooltipBody, NavTooltipTrigger } from '../components/nav-tooltip'
import { SrOnly } from '../components/sr-only'
import { supabase } from '../constants/supabase'
import { title } from '../helpers/dom'
import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: title(),
      },
    ],
  }),
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
            <Link className="font-semibold text-slate-100" to="/">
              <Inline spacing="xs">
                Lemfamy Recipes <Citrus className="text-yellow-300" size={NAV_ICON_SIZE} />
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

                  <NavSearch />

                  {/* <NavTooltip>
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
                  </NavTooltip> */}

                  {/* <DrawerWithTooltip /> */}

                  <NavTooltip>
                    <NavTooltipTrigger
                      as={
                        <NavLink preload={false} to="/logout">
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

                  <NavSearch />
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
    </>
  )
}
