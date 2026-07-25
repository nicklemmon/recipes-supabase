import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSession } from '../api/auth'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
  preload: false,
  beforeLoad: async () => {
    const { session } = await getSession()

    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
})

function PublicLayout() {
  return <Outlet />
}
