import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { PageBody } from '../../components/page-body'
import { Inline } from '../../components/inline'
import { TableLink } from '../../components/table-link'
import { RecipeTablePending } from '../../components/recipe-table-pending'
import { EmptyCell } from '../../components/empty-cell'
import { title } from '../../helpers/dom'
import { DietaryPreferenceTag } from '../../components/dietary-preference-tag'
import { findDietaryPrefLabel } from '../../helpers/dietary-preferences'
import { categoriesQueryOptions } from '../../queries/categories'
import { subcategoriesQueryOptions } from '../../queries/subcategories'
import { dietaryPreferencesQueryOptions } from '../../queries/dietary-preferences'
import { recipesQueryOptions } from '../../queries/recipes'

export const Route = createFileRoute('/recipes/favorites')({
  head: () => ({
    meta: [
      {
        title: title(['Favorites', 'Recipes']),
      },
    ],
  }),
  pendingComponent: FavoritesPending,
  loader: async ({ context }) => {
    const [recipes, categories, subCategories, dietaryPreferences] = await Promise.all([
      context.queryClient.ensureQueryData(recipesQueryOptions({ onlyFavorites: true })),
      context.queryClient.ensureQueryData(categoriesQueryOptions),
      context.queryClient.ensureQueryData(subcategoriesQueryOptions()),
      context.queryClient.ensureQueryData(dietaryPreferencesQueryOptions),
    ])

    return { recipes, categories, subCategories, dietaryPreferences }
  },
  component: RouteComponent,
})

function FavoritesPending() {
  return (
    <div>
      <PageHeader>
        <PageHeading>Favorites</PageHeading>
      </PageHeader>
      <PageBody>
        <RecipeTablePending showDietaryPref={false} />
      </PageBody>
    </div>
  )
}

function RouteComponent() {
  const { data: recipes } = useSuspenseQuery(recipesQueryOptions({ onlyFavorites: true }))
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions)
  const { data: subCategories } = useSuspenseQuery(subcategoriesQueryOptions())
  const { data: dietaryPreferences } = useSuspenseQuery(dietaryPreferencesQueryOptions)

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
        <PageHeading>Favorites</PageHeading>
      </PageHeader>

      <PageBody>
        <div className="border border-x-0 border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-md border-collapse text-slate-700 dark:text-slate-300">
            <caption className="sr-only">Recipes</caption>

            <thead className="border-b-2 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="font-medium p-4 dark:text-slate-200">Recipe</th>
                <th className="font-medium p-4 hidden md:table-cell dark:text-slate-200">
                  Dietary pref.
                </th>
                <th className="font-medium p-4 text-right dark:text-slate-200">Rating</th>
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
                        search={{
                          from: 'favorites',
                        }}
                        hideChevronOnMobile
                      >
                        {recipe.title}
                      </TableLink>
                    </td>

                    <td className="p-4 hidden md:table-cell">
                      <Inline spacing="xs">
                        {recipe.dietary_pref.map((slug) => (
                          <DietaryPreferenceTag
                            key={slug}
                            label={findDietaryPrefLabel(dietaryPreferences, slug)}
                          />
                        ))}
                      </Inline>
                    </td>

                    <td className="p-4 text-right">
                      {recipe.rating == null ? (
                        <EmptyCell label="No rating" />
                      ) : (
                        <>
                          <span className="md:hidden">{recipe.rating}&nbsp;stars</span>

                          <Inline spacing="xs" className="hidden md:inline-flex">
                            {[...new Array(recipe.rating)].map((_star, index) => (
                              <Star
                                key={`${recipe.id}-start-${index}`}
                                size={16}
                                className="text-yellow-500 fill-yellow-200"
                              />
                            ))}
                          </Inline>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PageBody>
    </div>
  )
}
