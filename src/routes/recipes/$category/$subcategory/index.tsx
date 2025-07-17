import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Star } from 'lucide-react'

import { getCategoryBySlug } from '../../../../api/categories'
import { getRecipes } from '../../../../api/recipes'
import { getSubcategoryBySlug } from '../../../../api/subcategories'
import { Inline } from '../../../../components/inline'
import { PageBackLink } from '../../../../components/page-actions'
import { PageBody } from '../../../../components/page-body'
import { PageHeader } from '../../../../components/page-header'
import { PageHeading } from '../../../../components/page-heading'
import { title } from '../../../../helpers/dom'

export const Route = createFileRoute('/recipes/$category/$subcategory/')({
  component: RouteComponent,
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: title([loaderData?.subcategory?.title, loaderData?.category?.title]),
        },
      ],
    }
  },
  loader: async ({ params }) => {
    const { category: categorySlug, subcategory: subcategorySlug } = params
    const category = await getCategoryBySlug(categorySlug)
    const subcategory = await getSubcategoryBySlug(subcategorySlug)

    return {
      category,
      recipes: await getRecipes({
        categoryId: category.id,
        subcategoryId: subcategory.id,
      }),
      subcategory,
    }
  },
})

function RouteComponent() {
  const { category, recipes, subcategory } = Route.useLoaderData()

  return (
    <div>
      <PageHeader>
        <PageHeading>{subcategory.title}</PageHeading>

        <PageBackLink params={{ category: category.slug }} to="/recipes/$category">
          Back to {category.title}
        </PageBackLink>
      </PageHeader>

      <PageBody>
        {recipes.length === 0 ? (
          <p className="text-slate-700">
            No recipes <span className="font-bold">&quot;{subcategory.title}&quot;</span> recipes
            yet.
          </p>
        ) : (
          <div className="border border-x-0 border-slate-200">
            <table className="w-full text-left text-md border-collapse text-slate-700">
              <thead className="border-b-2 border-slate-200">
                <tr>
                  <th className="font-medium p-4">Recipe</th>
                  <th className="font-medium p-4 hidden md:table-cell">Dietary preferences</th>
                  <th className="font-medium p-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => {
                  return (
                    <tr className="border-b border-slate-200" key={recipe.id}>
                      <td className="p-4">
                        <Link
                          className="text-indigo-600 font-medium"
                          params={{
                            category: category.slug,
                            recipe: recipe.slug,
                            subcategory: subcategory.slug,
                          }}
                          to="/recipes/$category/$subcategory/$recipe/view"
                        >
                          <Inline spacing="sm">
                            {recipe.title}
                            <ChevronRight className="hidden md:inline-flex" size={16} />
                          </Inline>
                        </Link>
                      </td>

                      <td className="p-4 hidden md:table-cell">
                        {recipe.dietary_pref.map((pref) => {
                          return pref
                        })}
                      </td>

                      <td className="p-4 text-right">
                        <span className="md:hidden">{recipe.rating}&nbsp;stars</span>

                        <Inline className="hidden md:inline-flex" spacing="xs">
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
        )}
      </PageBody>
    </div>
  )
}
