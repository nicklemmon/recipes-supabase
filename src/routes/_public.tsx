import { createFileRoute, redirect } from '@tanstack/react-router'

import { getSession } from '../api/auth'

export const Route = createFileRoute('/_public')({
  beforeLoad: async () => {
    const { session } = await getSession()

    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RouteComponent,
  preload: false,
})

function RouteComponent() {
  return <div>Hello &quot;/_public&quot;!</div>
}
