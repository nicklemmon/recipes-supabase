import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
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
import { RecipeTableSkeleton } from '../../../../components/recipe-table-skeleton'

export const Route = createFileRoute('/recipes/$category/$subcategory/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { subcategory: subcategorySlug, category: categorySlug } = params

    // Start both promises in parallel
    const [category, subcategory] = await Promise.all([
      getCategoryBySlug(categorySlug),
      getSubcategoryBySlug(subcategorySlug),
    ])

    return {
      category,
      subcategory,
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
  const { category, subcategory } = Route.useLoaderData()

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes', 'category', category.id, 'subcategory', subcategory.id],
    queryFn: () =>
      getRecipes({
        categoryId: category.id,
        subcategoryId: subcategory.id,
      }),
  })

  return (
    <div>
      <PageHeader>
        <PageHeading>{subcategory.title}</PageHeading>

        <PageBackLink to="/recipes/$category" params={{ category: category.slug }}>
          Back to {category.title}
        </PageBackLink>
      </PageHeader>

      <PageBody>
        {isLoading ? (
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
                {Array.from({ length: 5 }).map((_, index) => (
                  <RecipeTableSkeleton key={index} delay={index * 100} />
                ))}
              </tbody>
            </table>
          </div>
        ) : recipes ? (
          <RecipesTable recipes={recipes} category={category} subcategory={subcategory} />
        ) : null}
      </PageBody>
    </div>
  )
}

type Recipe = {
  id: number
  slug: string
  title: string
  dietary_pref: string[]
  rating: number
}

type Category = {
  id: number
  slug: string
  title: string
}

type Subcategory = {
  id: number
  slug: string
  title: string
}

function RecipesTable({
  recipes,
  category,
  subcategory,
}: {
  recipes: Recipe[]
  category: Category
  subcategory: Subcategory
}) {
  return (
    <>
      {recipes.length === 0 ? (
        <p className="text-slate-700">
          No <span className="font-bold">&quot;{subcategory.title}&quot;</span> recipes yet.
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
                          <ChevronRight size={16} className="hidden md:inline-flex" />
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

                      <Inline spacing="xs" className="hidden md:inline-flex">
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
    </>
  )
}
