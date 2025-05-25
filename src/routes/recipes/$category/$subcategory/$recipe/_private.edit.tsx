import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipes/$category/$subcategory/$recipe/_private/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recipes/$category/$subcategory/$recipe/edit"!</div>
}
