import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { DietaryPreferenceTag } from '../../../../components/dietary-preference-tag'
import { findDietaryPrefLabel } from '../../../../helpers/dietary-preferences'
import { title } from '../../../../helpers/dom'
import { PageBody } from '../../../../components/page-body'
import { PageHeader } from '../../../../components/page-header'
import { PageHeading } from '../../../../components/page-heading'
import { PageBackLink } from '../../../../components/page-actions'
import { Inline } from '../../../../components/inline'
import { EmptyCell } from '../../../../components/empty-cell'
import { TableLink } from '../../../../components/table-link'
import { RecipeTablePending } from '../../../../components/recipe-table-pending'
import { categoryBySlugQueryOptions } from '../../../../queries/categories'
import { subcategoryBySlugQueryOptions } from '../../../../queries/subcategories'
import { dietaryPreferencesQueryOptions } from '../../../../queries/dietary-preferences'
import { recipesQueryOptions } from '../../../../queries/recipes'

export const Route = createFileRoute('/recipes/$category/$subcategory/')({
  component: RouteComponent,
  pendingComponent: SubcategoryPending,
  loader: async ({ context, params }) => {
    const { subcategory: subcategorySlug, category: categorySlug } = params

    const [category, subcategory, dietaryPreferences] = await Promise.all([
      context.queryClient.ensureQueryData(categoryBySlugQueryOptions(categorySlug)),
      context.queryClient.ensureQueryData(subcategoryBySlugQueryOptions(subcategorySlug)),
      context.queryClient.ensureQueryData(dietaryPreferencesQueryOptions),
    ])

    const recipes = await context.queryClient.ensureQueryData(
      recipesQueryOptions({ categoryId: category.id, subcategoryId: subcategory.id }),
    )

    return {
      category,
      subcategory,
      recipes,
      dietaryPreferences,
    }
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: title([loaderData?.subcategory?.title, loaderData?.category?.title]),
        },
      ],
    }
  },
})

function SubcategoryPending() {
  return (
    <div>
      <PageHeader>
        <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
      </PageHeader>
      <PageBody>
        <RecipeTablePending />
      </PageBody>
    </div>
  )
}

function RouteComponent() {
  const { category: categorySlug, subcategory: subcategorySlug } = Route.useParams()
  const { data: category } = useSuspenseQuery(categoryBySlugQueryOptions(categorySlug))
  const { data: subcategory } = useSuspenseQuery(subcategoryBySlugQueryOptions(subcategorySlug))
  const { data: dietaryPreferences } = useSuspenseQuery(dietaryPreferencesQueryOptions)
  const { data: recipes } = useSuspenseQuery(
    recipesQueryOptions({ categoryId: category.id, subcategoryId: subcategory.id }),
  )

  return (
    <div>
      <PageHeader>
        <PageHeading>{subcategory.title}</PageHeading>

        <PageBackLink to="/recipes/$category" params={{ category: category.slug }}>
          Back to {category.title}
        </PageBackLink>
      </PageHeader>

      <PageBody>
        {recipes.length === 0 ? (
          <p className="text-slate-700 dark:text-slate-300">
            No <span className="font-bold">&quot;{subcategory.title}&quot;</span> recipes yet.
          </p>
        ) : (
          <div className="border border-x-0 border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-md border-collapse text-slate-700 dark:text-slate-300">
              <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="font-medium p-4 dark:text-slate-200">Recipe</th>
                  <th className="font-medium p-4 hidden md:table-cell dark:text-slate-200">
                    Dietary preferences
                  </th>
                  <th className="font-medium p-4 text-right dark:text-slate-200">Rating</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => {
                  return (
                    <tr
                      key={recipe.id}
                      className="group border-b border-slate-200 dark:border-slate-800"
                    >
                      <td className="p-4">
                        <TableLink
                          to="/recipes/$category/$subcategory/$recipe/view"
                          params={{
                            category: category.slug,
                            subcategory: subcategory.slug,
                            recipe: recipe.slug,
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
        )}
      </PageBody>
    </div>
  )
}
