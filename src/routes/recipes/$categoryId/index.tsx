import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { getSubcategories } from '../../../api/subcategories'
import { getCategoryBySlug } from '../../../api/categories'

export const Route = createFileRoute('/recipes/$categoryId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const category = await getCategoryBySlug(params.categoryId)
    const subcategories = await getSubcategories(category.id)

    return {
      category,
      subcategories,
    }
  },
})

function RouteComponent() {
  const { category, subcategories } = Route.useLoaderData()
  console.log('subcategories', subcategories)

  return (
    <div>
      <h1 className="text-3xl">{category.title}</h1>

      <ul>
        {subcategories.map((subcategory) => {
          return (
            <li key={subcategory.id}>
              <Link to={`/recipes/${category.slug}/${subcategory.slug}`}>{subcategory.title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
