import { createFileRoute, Link } from '@tanstack/react-router'
import { getCategoryBySlug } from '../../../../api/categories'
import { getSubcategoryBySlug } from '../../../../api/subcategories'
import { getRecipes } from '../../../../api/recipes'
import { PageHeader } from '../../../../components/page-header'
import { PageHeading } from '../../../../components/page-heading'

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
  const { category, subcategory, recipes } = Route.useLoaderData()

  return (
    <div>
      <PageHeader>
        <PageHeading>{subcategory.title}</PageHeading>

        <Link to="/recipes/$category" params={{ category: category.slug }}>
          Back to {category.title}
        </Link>
      </PageHeader>

      {recipes.length === 0 ? (
        <div>No recipes yet.</div>
      ) : (
        <ul>
          {recipes.map((recipe) => {
            return (
              <li key={recipe.id}>
                <Link
                  to="/recipes/$category/$subcategory/$recipe"
                  params={{
                    category: category.slug,
                    subcategory: subcategory.slug,
                    recipe: recipe.slug,
                  }}
                >
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
