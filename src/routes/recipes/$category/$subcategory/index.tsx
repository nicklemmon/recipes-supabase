import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Star } from 'lucide-react'
import { getCategoryBySlug } from '../../../../api/categories'
import { getSubcategoryBySlug } from '../../../../api/subcategories'
import { getRecipes } from '../../../../api/recipes'
import { title } from '../../../../helpers/dom'
import { PageBody } from '../../../../components/page-body'
import { PageHeader } from '../../../../components/page-header'
import { PageHeading } from '../../../../components/page-heading'
import { PageBackLink } from '../../../../components/page-actions'
import { Inline } from '../../../../components/inline'

export const Route = createFileRoute('/recipes/$category/$subcategory/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { subcategory: subcategorySlug, category: categorySlug } = params
    const category = await getCategoryBySlug(categorySlug)
    const subcategory = await getSubcategoryBySlug(subcategorySlug)

    return {
      category,
      subcategory,
      recipes: await getRecipes({
        categoryId: category.id,
        subcategoryId: subcategory.id,
      }),
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

function RouteComponent() {
  const { category, subcategory, recipes } = Route.useLoaderData()

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
          <div>No recipes yet.</div>
        ) : (
          <div className="border border-x-0 border-slate-200">
            <table className="w-full text-left text-md border-collapse text-slate-700">
              <thead className="border-b-2 border-slate-200">
                <tr>
                  <th className="font-medium p-4">Recipe</th>
                  <th className="font-medium p-4">Dietary preferences</th>
                  <th className="font-medium p-4">Rating</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => {
                  return (
                    <tr key={recipe.id} className="border-b border-slate-200">
                      <td className="p-4">
                        <Link
                          className="text-indigo-600 font-medium"
                          to="/recipes/$category/$subcategory/$recipe/view"
                          params={{
                            category: category.slug,
                            subcategory: subcategory.slug,
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
        )}
      </PageBody>
    </div>
  )
}
