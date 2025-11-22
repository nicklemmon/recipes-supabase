import { createFileRoute, Await } from '@tanstack/react-router'
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
      subcategories: getSubcategories(category.id),
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
  const { category, subcategories } = Route.useLoaderData()

  return (
    <div>
      <PageHeader>
        <PageHeading>{category.title}</PageHeading>
        <PageBackLink to="/">Back home</PageBackLink>
      </PageHeader>

      <PageBody>
        <Await
          promise={subcategories}
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <CategoryLinkSkeleton key={index} />
              ))}
            </div>
          }
        >
          {(resolvedSubcategories) => (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {resolvedSubcategories.map((subcategory) => {
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
          )}
        </Await>
      </PageBody>
    </div>
  )
}
