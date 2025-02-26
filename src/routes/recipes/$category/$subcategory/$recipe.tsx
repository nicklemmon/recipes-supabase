import { createFileRoute, Link } from '@tanstack/react-router'
import markdownit from 'markdown-it'
import DOMPurify from 'dompurify'
import { getCategoryBySlug } from '../../../../api/categories'
import { getSubcategoryBySlug } from '../../../../api/subcategories'
import { getRecipeBySlug } from '../../../../api/recipes'
import { PageHeader } from '../../../../components/page-header'
import { PageHeading } from '../../../../components/page-heading'
import { PageBackLink } from '../../../../components/page-back-link'
import { PageBody } from '../../../../components/page-body'
import { Stack } from '../../../../components/stack'

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
  const { subcategory: subcategorySlug, category: categorySlug } = Route.useParams()
  const { recipe, category, subcategory } = Route.useLoaderData()
  const ingredients = md.render(recipe.ingredients_md)
  const directions = md.render(recipe.directions_md)

  return (
    <div>
      <PageHeader>
        <PageHeading>{recipe.title}</PageHeading>

        <PageBackLink
          to="/recipes/$category/$subcategory"
          params={{
            category: categorySlug,
            subcategory: subcategorySlug,
          }}
        >
          Back to {subcategory.title}
        </PageBackLink>
      </PageHeader>

      <PageBody>
        <Stack>
          <Stack spacing="xs">
            <h2 className="text-lg md:text-2xl font-bold text-slate-700">Ingredients</h2>

            <div
              className="prose text-slate-600"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ingredients) }}
            />
          </Stack>

          <Stack spacing="xs">
            <h2 className="text-lg md:text-2xl font-bold text-slate-700">Directions</h2>

            <div
              className="prose text-slate-600"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(directions) }}
            />
          </Stack>
        </Stack>
      </PageBody>
    </div>
  )
}
