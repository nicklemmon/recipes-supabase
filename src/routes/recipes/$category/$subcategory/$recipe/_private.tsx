import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSession } from '../../../../../api/auth'

export const Route = createFileRoute('/recipes/$category/$subcategory/$recipe/_private')({
  preload: false,
  beforeLoad: async ({ location }) => {
    const { session } = await getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    return {
      session,
    }
  },
  component: PrivateLayout,
})

function PrivateLayout() {
  return <Outlet />
}
