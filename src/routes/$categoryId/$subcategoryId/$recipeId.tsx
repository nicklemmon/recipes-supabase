import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$categoryId/$subcategoryId/$recipeId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    console.log(params.recipeId)
  }
})

function RouteComponent() {
  const { recipeId } = Route.useParams()

  return <div>Hello {recipeId}!</div>
}
