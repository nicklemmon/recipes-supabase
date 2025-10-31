import { Await, createFileRoute, defer } from '@tanstack/react-router'
import { Suspense } from 'react'

import { getCategoryBySlug } from '../../../api/categories'
import { getSubcategories } from '../../../api/subcategories'
import { CategoryLink } from '../../../components/category-link'
import { CategoryLinkSkeleton } from '../../../components/category-skeleton'
import { PageBackLink } from '../../../components/page-actions'
import { PageBody } from '../../../components/page-body'
import { PageHeader } from '../../../components/page-header'
import { PageHeading } from '../../../components/page-heading'
import { Stack } from '../../../components/stack'
import { title } from '../../../helpers/dom'

export const Route = createFileRoute('/recipes/$category/')({
  component: RouteComponent,
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: title([loaderData?.category?.title]),
        },
      ],
    }
  },
  loader: async ({ params }) => {
    const categoryPromise = getCategoryBySlug(params.category)
    const category = await categoryPromise

    return {
      category,
      subcategories: defer(getSubcategories(category.id)),
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
                <CategoryLinkSkeleton delay={index * 100} key={index} />
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
                        params={{
                          category: category.slug,
                          subcategory: subcategory.slug,
                        }}
                        to="/recipes/$category/$subcategory"
                      >
                        <Stack align="center" spacing="xs">
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
