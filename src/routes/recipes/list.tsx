import { createFileRoute, Link, Await } from '@tanstack/react-router'
import { z } from 'zod'
import { Star, ChevronRight } from 'lucide-react'
import { title } from '../../helpers/dom'
import { Inline } from '../../components/inline'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { PageBody } from '../../components/page-body'
import { RecipeTableSkeleton } from '../../components/recipe-table-skeleton'
import { getRecipes } from '../../api/recipes'
import { getCategories } from '../../api/categories'
import { getSubcategories } from '../../api/subcategories'
import { Stack } from '../../components/stack'

const SearchSchema = z.object({
  s: z.string().optional(),
})

export const Route = createFileRoute('/recipes/list')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: title(['Recipes']),
      },
    ],
  }),
  loader: async ({ deps }) => {
    // @ts-expect-error - unclear why this is happening...
    const s = deps.s || ''

    return {
      searchStr: s,
      recipesData: (async () => {
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

        return recipesWithSlugs
      })(),
    }
  },
  loaderDeps: ({ search }) => {
    return {
      s: search.s ?? '',
    }
  },
  validateSearch: SearchSchema,
})

function RouteComponent() {
  const { recipesData, searchStr } = Route.useLoaderData()

  return (
    <div>
      <PageHeader>
        <PageHeading>Recipes</PageHeading>
      </PageHeader>

      <PageBody>
        <Await
          promise={recipesData}
          fallback={
            <Stack spacing="lg">
              <p className="text-slate-600 dark:text-slate-400">
                Showing results for search{' '}
                <span className="font-bold">&quot;{searchStr}&quot;</span> &mdash; loading...
              </p>

              <div className="border border-x-0 border-slate-200 dark:border-slate-700 w-full">
                <table className="w-full text-left text-md border-collapse text-slate-700 dark:text-slate-300">
                  <caption className="sr-only">Recipes</caption>

                  <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="font-medium p-4 dark:text-slate-200">Recipe</th>
                      <th className="font-medium p-4 dark:text-slate-200">Dietary pref.</th>
                      <th className="font-medium p-4 dark:text-slate-200">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RecipeTableSkeleton key={index} showDietaryPref={false} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Stack>
          }
        >
          {(recipesWithSlugs) => (
            <>
              {recipesWithSlugs.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">
                  Showing results for search{' '}
                  <span className="font-bold">&quot;{searchStr}&quot;</span> &mdash; no recipes
                  found.
                </p>
              ) : (
                <Stack spacing="lg">
                  <p className="text-slate-600 dark:text-slate-400">
                    Showing results for search{' '}
                    <span className="font-bold">&quot;{searchStr}&quot;</span> &mdash;{' '}
                    {recipesWithSlugs.length} recipes found.
                  </p>

                  <div className="border border-x-0 border-slate-200 dark:border-slate-700 w-full">
                    <table className="w-full text-left text-md border-collapse text-slate-700 dark:text-slate-300">
                      <caption className="sr-only">Recipes</caption>

                      <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="font-medium p-4 dark:text-slate-200">Recipe</th>
                          <th className="font-medium p-4 dark:text-slate-200">Dietary pref.</th>
                          <th className="font-medium p-4 dark:text-slate-200">Rating</th>
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
                            <tr
                              key={recipe.id}
                              className="border-b border-slate-200 dark:border-slate-800"
                            >
                              <td className="p-4">
                                <Link
                                  className="text-indigo-600 dark:text-indigo-400 font-medium"
                                  to="/recipes/$category/$subcategory/$recipe/view"
                                  params={{
                                    category: recipe.categorySlug,
                                    subcategory: recipe.subCategorySlug,
                                    recipe: recipe.slug,
                                  }}
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
                                      key={`${recipe.id}-start-${index}`}
                                      size={16}
                                      className="text-yellow-500 fill-yellow-200"
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
            </>
          )}
        </Await>
      </PageBody>
    </div>
  )
}
