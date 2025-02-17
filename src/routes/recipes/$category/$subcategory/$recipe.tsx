import { createFileRoute } from '@tanstack/react-router'
import markdownit from 'markdown-it'
import DOMPurify from 'dompurify'
import { getCategoryBySlug } from '../../../../api/categories'
import { getSubcategoryBySlug } from '../../../../api/subcategories'
import { getRecipeBySlug } from '../../../../api/recipes'

const md = markdownit()

export const Route = createFileRoute('/recipes/$category/$subcategory/$recipe')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { subcategory: subcategorySlug, category: categorySlug, recipe: recipeSlug } = params
    const category = await getCategoryBySlug(categorySlug)
    const subcategory = await getSubcategoryBySlug(subcategorySlug)
    const recipe = await getRecipeBySlug({
      slug: recipeSlug,
      categoryId: category.id,
      subcategoryId: subcategory.id,
    })

    return {
      category,
      subcategory,
      recipe,
    }
  },
})

function RouteComponent() {
  const { recipe, category, subcategory } = Route.useLoaderData()
  const ingredients = md.render(recipe.ingredients_md)
  const directions = md.render(recipe.directions_md)

  return (
    <div>
      <h1>{recipe.title}</h1>

      <h2>Ingredients</h2>

      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ingredients) }} />

      <h2>Directions</h2>

      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(directions) }} />
    </div>
  )
}
