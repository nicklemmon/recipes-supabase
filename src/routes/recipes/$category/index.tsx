import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { CategoryLink } from '../../../components/category-link'
import { CategoryGridPending } from '../../../components/category-grid-pending'
import { Stack } from '../../../components/stack'
import { PageBody } from '../../../components/page-body'
import { PageHeading } from '../../../components/page-heading'
import { PageHeader } from '../../../components/page-header'
import { PageBackLink } from '../../../components/page-actions'
import { title } from '../../../helpers/dom'
import { categoryBySlugQueryOptions } from '../../../queries/categories'
import { subcategoriesQueryOptions } from '../../../queries/subcategories'
import { loadQuery } from '../../../queries/query-client'

export const Route = createFileRoute('/recipes/$category/')({
  component: RouteComponent,
  pendingComponent: CategoryPending,
  loader: async ({ context, params }) => {
    const category = await loadQuery(
      context.queryClient,
      categoryBySlugQueryOptions(params.category),
    )
    const subcategories = await loadQuery(
      context.queryClient,
      subcategoriesQueryOptions(category.id),
    )

    return {
      category,
      subcategories,
    }
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: title([loaderData?.category?.title]),
        },
      ],
    }
  },
})

function CategoryPending() {
  return (
    <div>
      <PageHeader>
        <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
      </PageHeader>
      <PageBody>
        <CategoryGridPending />
      </PageBody>
    </div>
  )
}

function RouteComponent() {
  const { category: categorySlug } = Route.useParams()
  const { data: category } = useSuspenseQuery(categoryBySlugQueryOptions(categorySlug))
  const { data: subcategories } = useSuspenseQuery(subcategoriesQueryOptions(category.id))

  return (
    <div>
      <PageHeader>
        <PageHeading>{category.title}</PageHeading>
        <PageBackLink to="/">Back home</PageBackLink>
      </PageHeader>

      <PageBody>
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
                    <div className="text-xl">{subcategory.emoji}</div>
                    <div>{subcategory.title}</div>
                  </Stack>
                </CategoryLink>
              </li>
            )
          })}
        </ul>
      </PageBody>
    </div>
  )
}
