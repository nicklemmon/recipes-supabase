import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Star } from 'lucide-react'
import { title } from '../../helpers/dom'
import { Inline } from '../../components/inline'
import { TableLink } from '../../components/table-link'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { PageBody } from '../../components/page-body'
import { RecipeTablePending } from '../../components/recipe-table-pending'
import { EmptyCell } from '../../components/empty-cell'
import { DietaryPreferenceTag } from '../../components/dietary-preference-tag'
import { Stack } from '../../components/stack'
import { findDietaryPrefLabel } from '../../helpers/dietary-preferences'
import { categoriesQueryOptions } from '../../queries/categories'
import { subcategoriesQueryOptions } from '../../queries/subcategories'
import { dietaryPreferencesQueryOptions } from '../../queries/dietary-preferences'
import { recipesQueryOptions } from '../../queries/recipes'

const SearchSchema = z.object({
  s: z.string().optional(),
})

export const Route = createFileRoute('/recipes/list')({
  component: RouteComponent,
  pendingComponent: ListPending,
  head: () => ({
    meta: [
      {
        title: title(['Recipes']),
      },
    ],
  }),
  loader: async ({ context, deps }) => {
    // TanStack Router types deps as {} unless the route module graph is fully inferred here
    const s = (deps as { s?: string }).s || ''
    const titleSearch = s || undefined

    const [dietaryPreferences, recipes, categories, subCategories] = await Promise.all([
      context.queryClient.ensureQueryData(dietaryPreferencesQueryOptions),
      context.queryClient.ensureQueryData(recipesQueryOptions({ titleSearch })),
      context.queryClient.ensureQueryData(categoriesQueryOptions),
      context.queryClient.ensureQueryData(subcategoriesQueryOptions()),
    ])

    return {
      searchStr: s,
      dietaryPreferences,
      recipes,
      categories,
      subCategories,
    }
  },
  loaderDeps: ({ search }) => {
    return {
      s: search.s ?? '',
    }
  },
  validateSearch: SearchSchema,
})

function ListPending() {
  const { s } = Route.useSearch()
  const searchStr = s ?? ''

  return (
    <div>
      <PageHeader>
        <PageHeading>Recipes</PageHeading>
      </PageHeader>
      <PageBody>
        <Stack spacing="lg">
          <p className="text-slate-600 dark:text-slate-400">
            Showing results for search <span className="font-bold">&quot;{searchStr}&quot;</span>{' '}
            &mdash; loading...
          </p>
          <RecipeTablePending showDietaryPref={false} />
        </Stack>
      </PageBody>
    </div>
  )
}

function RouteComponent() {
  const { s } = Route.useSearch()
  const searchStr = s ?? ''
  const titleSearch = searchStr || undefined

  const { data: dietaryPreferences } = useSuspenseQuery(dietaryPreferencesQueryOptions)
  const { data: recipes } = useSuspenseQuery(recipesQueryOptions({ titleSearch }))
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions)
  const { data: subCategories } = useSuspenseQuery(subcategoriesQueryOptions())

  const recipesWithSlugs = recipes.map((recipe) => {
    return {
      ...recipe,
      categorySlug: categories.find((category) => category.id === recipe.category_id)?.slug,
      subCategorySlug: subCategories.find((subCategory) => subCategory.id === recipe.subcategory_id)
        ?.slug,
    }
  })

  return (
    <div>
      <PageHeader>
        <PageHeading>Recipes</PageHeading>
      </PageHeader>

      <PageBody>
        {recipesWithSlugs.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">
            Showing results for search <span className="font-bold">&quot;{searchStr}&quot;</span>{' '}
            &mdash; no recipes found.
          </p>
        ) : (
          <Stack spacing="lg">
            <p className="text-slate-600 dark:text-slate-400">
              Showing results for search <span className="font-bold">&quot;{searchStr}&quot;</span>{' '}
              &mdash; {recipesWithSlugs.length} recipes found.
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
                        className="group border-b border-slate-200 dark:border-slate-800"
                      >
                        <td className="p-4">
                          <TableLink
                            to="/recipes/$category/$subcategory/$recipe/view"
                            params={{
                              category: recipe.categorySlug,
                              subcategory: recipe.subCategorySlug,
                              recipe: recipe.slug,
                            }}
                          >
                            {recipe.title}
                          </TableLink>
                        </td>

                        <td className="p-4">
                          <Inline spacing="xs">
                            {recipe.dietary_pref.map((slug) => (
                              <DietaryPreferenceTag
                                key={slug}
                                label={findDietaryPrefLabel(dietaryPreferences, slug)}
                              />
                            ))}
                          </Inline>
                        </td>

                        <td className="p-4">
                          {recipe.rating == null ? (
                            <EmptyCell label="No rating" />
                          ) : (
                            <Inline spacing="xs">
                              {[...new Array(recipe.rating)].map((_star, index) => (
                                <Star
                                  key={`${recipe.id}-start-${index}`}
                                  size={16}
                                  className="text-yellow-500 fill-yellow-200"
                                />
                              ))}
                            </Inline>
                          )}
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
