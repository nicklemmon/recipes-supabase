import { createFileRoute, redirect } from '@tanstack/react-router'

import { toast } from 'sonner'

import { signOut } from '../api/auth'

export const Route = createFileRoute('/logout')({
  beforeLoad: async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Unexpected error during logout:', err)

      throw err
    }

    toast.success('Successfully logged out')

    // Redirect to home or login page after logout
    throw redirect({
      replace: true,
      to: '/login',
    })
  },
  component: RouteComponent,
  preload: false,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Logging out...</p>
      </div>
    </div>
  )
}
