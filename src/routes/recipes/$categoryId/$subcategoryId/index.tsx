import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipes/$categoryId/$subcategoryId/')({
  component: RouteComponent,
  loader: async ({ params }) => {},
})

function RouteComponent() {
  return <div></div>
}
