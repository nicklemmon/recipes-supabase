import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$categoryId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    console.log(params.categoryId)
  }
})

function RouteComponent() {
  const { categoryId } = Route.useParams()

  return <div>Hello {categoryId}!</div>
}
