import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    // TODO: Somehow handle auth
  },
  component: AuthLayout,
})

function AuthLayout() {
  return <Outlet />
}
