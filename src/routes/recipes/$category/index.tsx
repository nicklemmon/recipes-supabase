import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { getSubcategories } from '../../../api/subcategories'
import { getCategoryBySlug } from '../../../api/categories'
import { CategoryLink } from '../../../components/category-link'
import { Stack } from '../../../components/stack'
import { PageHeading } from '../../../components/page-heading'
import { PageHeader } from '../../../components/page-header'

export const Route = createFileRoute('/recipes/$category/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const category = await getCategoryBySlug(params.category)
    const subcategories = await getSubcategories(category.id)

    return {
      category,
      subcategories,
    }
  },
})

function RouteComponent() {
  const { category, subcategories } = Route.useLoaderData()

  return (
    <div>
      <PageHeader>
        <PageHeading>{category.title}</PageHeading>
        <Link to="/">Back home</Link>
      </PageHeader>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subcategories.map((subcategory) => {
          return (
            <li key={subcategory.id}>
              <CategoryLink
                to="/recipes/$category/$subcategory"
                params={{
                  category: category.slug,
                  subcategory: subcategory.slug,
                }}
              >
                <Stack spacing="xs" align="center">
                  <div>{subcategory.emoji}</div>
                  <div>{subcategory.title}</div>
                </Stack>
              </CategoryLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
