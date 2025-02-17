import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipes/favorites')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recipes/favorites"!</div>
}
