import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getSubcategories } from '../../../api/subcategories'
import { getCategoryBySlug } from '../../../api/categories'
import { CategoryLink } from '../../../components/category-link'
import { CategoryLinkSkeleton } from '../../../components/category-skeleton'
import { Stack } from '../../../components/stack'
import { PageBody } from '../../../components/page-body'
import { PageHeading } from '../../../components/page-heading'
import { PageHeader } from '../../../components/page-header'
import { PageBackLink } from '../../../components/page-actions'
import { title } from '../../../helpers/dom'

export const Route = createFileRoute('/recipes/$category/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const category = await getCategoryBySlug(params.category)

    return {
      category,
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

function RouteComponent() {
  const { category } = Route.useLoaderData()

  const { data: subcategories, isLoading } = useQuery({
    queryKey: ['subcategories', 'category', category.id],
    queryFn: () => getSubcategories(category.id),
  })

  return (
    <div>
      <PageHeader>
        <PageHeading>{category.title}</PageHeading>
        <PageBackLink to="/">Back home</PageBackLink>
      </PageHeader>

      <PageBody>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <CategoryLinkSkeleton key={index} delay={index * 100} />
            ))}
          </div>
        ) : subcategories ? (
          <SubcategoriesList subcategories={subcategories} category={category} />
        ) : null}
      </PageBody>
    </div>
  )
}

function SubcategoriesList({
  subcategories,
  category,
}: {
  subcategories: Array<{
    id: number
    slug: string
    title: string
    emoji: string
  }>
  category: {
    slug: string
    title: string
  }
}) {
  return (
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
  )
}
