import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSession } from '../../api/auth'

export const Route = createFileRoute('/recipes/_auth')({
  preload: false,
  beforeLoad: async ({ location }) => {
    const { session } = await getSession()
    console.log('session', session)

    if (!session) {
      console.log('No session')
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
  component: AuthLayout,
})

function AuthLayout() {
  return <Outlet />
}
