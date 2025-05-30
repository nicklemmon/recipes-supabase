import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Star } from 'lucide-react'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { PageBody } from '../../components/page-body'
import { Inline } from '../../components/inline'
import { title } from '../../helpers/dom'
import { getRecipes } from '../../api/recipes'
import { getCategories } from '../../api/categories'
import { getSubcategories } from '../../api/subcategories'

export const Route = createFileRoute('/recipes/favorites')({
  head: () => ({
    meta: [
      {
        title: title(['Favorites', 'Recipes']),
      },
    ],
  }),
  loader: async () => {
    const recipes = await getRecipes({ onlyFavorites: true })
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
      subCategories,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { recipesWithSlugs } = Route.useLoaderData()

  return (
    <div>
      <PageHeader>
        <PageHeading>Favorites</PageHeading>
      </PageHeader>

      <PageBody>
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
                <tr key={recipe.id} className="border-b border-slate-200">
                  <td className="p-4">
                    <Link
                      className="text-indigo-600 font-medium"
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
      </PageBody>
    </div>
  )
}
