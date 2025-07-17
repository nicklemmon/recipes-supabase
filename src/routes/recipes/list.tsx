import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Star } from 'lucide-react'

import { getCategories } from '../../api/categories'
import { getRecipes } from '../../api/recipes'
import { getSubcategories } from '../../api/subcategories'
import { Inline } from '../../components/inline'
import { PageBody } from '../../components/page-body'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { Stack } from '../../components/stack'
import { title } from '../../helpers/dom'

export const Route = createFileRoute('/recipes/list')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: title(['Recipes']),
      },
    ],
  }),
  loader: async ({ deps: { s } }) => {
    const recipes = await getRecipes({ titleSearch: s })
    const categories = await getCategories()
    const subCategories = await getSubcategories()
    const recipesWithSlugs = recipes.map((recipe) => {
      return {
        ...recipe,
        categorySlug: categories.find((category) => category.id === recipe.category_id)?.slug,
        subCategorySlug: subCategories.find(
          (subCategory) => subCategory.id === recipe.subcategory_id,
        )?.slug,
      }
    })

    return {
      categories,
      recipesWithSlugs,
      searchStr: s,
      subCategories,
    }
  },
  loaderDeps: ({ search }) => {
    return {
      // @ts-expect-error - search params not typed
      s: search['s'],
    }
  },
})

function RouteComponent() {
  const { recipesWithSlugs, searchStr } = Route.useLoaderData()

  return (
    <div>
      <PageHeader>
        <PageHeading>Recipes</PageHeading>
      </PageHeader>

      <PageBody>
        {recipesWithSlugs.length === 0 ? (
          <p className="text-slate-600">
            Showing results for search <span className="font-bold">&quot;{searchStr}&quot;</span>{' '}
            &mdash; no recipes found.
          </p>
        ) : (
          <Stack spacing="lg">
            <p className="text-slate-600">
              Showing results for search <span className="font-bold">&quot;{searchStr}&quot;</span>{' '}
              &mdash; {recipesWithSlugs.length} recipes found.
            </p>

            <div className="border border-x-0 border-slate-200 w-full">
              <table className="w-full text-left text-md border-collapse text-slate-700">
                <caption className="sr-only">Recipes</caption>

                <thead className="border-b-2 border-slate-200">
                  <tr>
                    <th className="font-medium p-4">Recipe</th>
                    <th className="font-medium p-4">Dietary pref.</th>
                    <th className="font-medium p-4">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {recipesWithSlugs.map((recipe) => {
                    if (
                      typeof recipe.categorySlug !== 'string' ||
                      typeof recipe.subCategorySlug !== 'string'
                    ) {
                      return null
                    }

                    return (
                      <tr className="border-b border-slate-200" key={recipe.id}>
                        <td className="p-4">
                          <Link
                            className="text-indigo-600 font-medium"
                            params={{
                              category: recipe.categorySlug,
                              recipe: recipe.slug,
                              subcategory: recipe.subCategorySlug,
                            }}
                            to="/recipes/$category/$subcategory/$recipe/view"
                          >
                            <Inline spacing="sm">
                              {recipe.title}
                              <ChevronRight size={16} />
                            </Inline>
                          </Link>
                        </td>

                        <td className="p-4">
                          {recipe.dietary_pref.map((pref) => {
                            return pref
                          })}
                        </td>

                        <td className="p-4">
                          <Inline spacing="xs">
                            {[...new Array(recipe.rating)].map((_star, index) => (
                              <Star
                                className="text-yellow-500 fill-yellow-200"
                                key={`${recipe.id}-start-${index}`}
                                size={16}
                              />
                            ))}
                          </Inline>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Stack>
        )}
      </PageBody>
    </div>
  )
}
