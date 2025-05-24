import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '../api/auth'

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
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

function RouteComponent() {
  return <div>Hello "/_public"!</div>
}
