import { createFileRoute, Link } from '@tanstack/react-router'
import { getCategoryBySlug } from '../../../../api/categories'
import { getSubcategoryBySlug } from '../../../../api/subcategories'
import { getRecipes } from '../../../../api/recipes'

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
})

function RouteComponent() {
  const { subcategory: subcategorySlug, category: categorySlug } = Route.useParams()
  const { category, subcategory, recipes } = Route.useLoaderData()
  console.log('recipes', recipes)

  return (
    <div>
      <h1 className="text-3xl">{subcategory.title}</h1>
      <Link to={`/recipes/${category.slug}`}>Back to {category.title}</Link>

      {recipes.length === 0 ? (
        <div>No recipes yet.</div>
      ) : (
        <ul>
          {recipes.map((recipe) => {
            return (
              <li key={recipe.id}>
                <Link to={`/recipes/${categorySlug}/${subcategorySlug}/${recipe.slug}`}>
                  {recipe.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
