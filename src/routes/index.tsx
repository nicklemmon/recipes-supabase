import { createFileRoute } from '@tanstack/react-router'

import { getCategories } from '../api/categories'
import { CategoryLink } from '../components/category-link'
import { PageBody } from '../components/page-body'
import { PageHeader } from '../components/page-header'
import { PageHeading } from '../components/page-heading'
import { Stack } from '../components/stack'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: async () => {
    return await getCategories()
  },
})

function HomeComponent() {
  const categories = Route.useLoaderData()

  return (
    <div>
      <PageHeader>
        <PageHeading>Categories</PageHeading>
      </PageHeader>

      <PageBody>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            return (
              <li key={category.id}>
                <CategoryLink params={{ category: category.slug }} to="/recipes/$category">
                  <Stack align="center" spacing="xs">
                    <div>{category.emoji}</div>
                    <div>{category.title}</div>
                  </Stack>
                </CategoryLink>
              </li>
            )
          })}

          <li>
            <CategoryLink to={`/recipes/favorites`}>
              <Stack align="center" spacing="xs">
                <div>⭐</div>
                <div>Favorites</div>
              </Stack>
            </CategoryLink>
          </li>
        </ul>
      </PageBody>
    </div>
  )
}
