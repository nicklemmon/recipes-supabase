import { createFileRoute, Await, defer } from '@tanstack/react-router'
import { Suspense } from 'react'
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
    const categoryPromise = getCategoryBySlug(params.category)
    const category = await categoryPromise

    return {
      category,
      subcategories: defer(getSubcategories(category.id)),
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
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <CategoryLinkSkeleton key={index} delay={index * 100} />
              ))}
            </div>
          }
        >
          <Await promise={subcategories}>
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
        </Suspense>
      </PageBody>
    </div>
  )
}
