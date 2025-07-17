import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSession } from '../../api/auth'

export const Route = createFileRoute('/recipes/_private')({
  beforeLoad: async ({ location }) => {
    const { session } = await getSession()

    if (!session) {
      throw redirect({
        search: {
          redirect: location.href,
        },
        to: '/login',
      })
    }

    return {
      session,
    }
  },
  component: PrivateLayout,
  preload: false,
})

function PrivateLayout() {
  return <Outlet />
}
