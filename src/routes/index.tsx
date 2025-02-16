import { createFileRoute, Link } from '@tanstack/react-router'
import { getCategories } from '../api/categories'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: async () => {
    return await getCategories()
  },
})

function HomeComponent() {
  const categories = Route.useLoaderData()

  console.log('categories', categories)

  return (
    <div>
      <h1>Home</h1>

      <ul>
        {categories.map((category) => {
          return (
            <li key={category.id}>
              <Link to={`/recipes/${category.slug}`}>{category.title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
