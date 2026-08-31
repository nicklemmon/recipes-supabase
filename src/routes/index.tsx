import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { CategoryLink } from '../components/category-link'
import { CategoryGridPending } from '../components/category-grid-pending'
import { Stack } from '../components/stack'
import { PageHeader } from '../components/page-header'
import { PageHeading } from '../components/page-heading'
import { PageBody } from '../components/page-body'
import { categoriesQueryOptions } from '../queries/categories'
import { loadQuery } from '../queries/query-client'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  pendingComponent: HomePending,
  loader: ({ context }) => loadQuery(context.queryClient, categoriesQueryOptions),
})

const GRID_CLASSES = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'

function HomePending() {
  return (
    <div>
      <PageHeader>
        <PageHeading>Categories</PageHeading>
      </PageHeader>
      <PageBody>
        <CategoryGridPending />
      </PageBody>
    </div>
  )
}

function RouteComponent() {
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions)

  return (
    <div>
      <PageHeader>
        <PageHeading>Categories</PageHeading>
      </PageHeader>

      <PageBody>
        <ul className={GRID_CLASSES}>
          {categories.map((category) => {
            return (
              <li key={category.id}>
                <CategoryLink to="/recipes/$category" params={{ category: category.slug }}>
                  <Stack spacing="xs" align="center">
                    <div>{category.emoji}</div>
                    <div>{category.title}</div>
                  </Stack>
                </CategoryLink>
              </li>
            )
          })}

          <li>
            <CategoryLink to={`/recipes/favorites`}>
              <Stack spacing="xs" align="center">
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
