import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categories'
import { CategoryLink } from '../components/category-link'
import { CategoryLinkSkeleton } from '../components/category-skeleton'
import { Stack } from '../components/stack'
import { PageHeader } from '../components/page-header'
import { PageHeading } from '../components/page-heading'
import { PageBody } from '../components/page-body'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  return (
    <div>
      <PageHeader>
        <PageHeading>Categories</PageHeading>
      </PageHeader>

      <PageBody>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CategoryLinkSkeleton key={index} delay={index * 100} />
            ))}
          </div>
        ) : categories ? (
          <CategoriesList categories={categories} />
        ) : null}
      </PageBody>
    </div>
  )
}

function CategoriesList({
  categories,
}: {
  categories: Array<{
    id: number
    slug: string
    title: string
    emoji: string
  }>
}) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
  )
}
