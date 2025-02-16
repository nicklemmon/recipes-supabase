import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$categoryId/$subcategoryId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    console.log(params.subcategoryId)
  }
})

function RouteComponent() {
  const { subcategoryId } = Route.useParams()

  return <div>Hello {subcategoryId}!</div>
}
