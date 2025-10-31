import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { getCategoryBySlug } from '../../../../../api/categories'
import { getCategories } from '../../../../../api/categories'
import { getRecipeBySlug, updateRecipe } from '../../../../../api/recipes'
import { getSubcategoryBySlug } from '../../../../../api/subcategories'
import { getSubcategories } from '../../../../../api/subcategories'
import { Button } from '../../../../../components/button'
import { FormControl } from '../../../../../components/form-control'
import { FormInput } from '../../../../../components/form-input'
import { FormLabel } from '../../../../../components/form-label'
import { FormSelect } from '../../../../../components/form-select'
import { FormTextarea } from '../../../../../components/form-textarea'
import { PageActions, PageBackLink, PageDeleteButton } from '../../../../../components/page-actions'
import { PageBody } from '../../../../../components/page-body'
import { PageHeader } from '../../../../../components/page-header'
import { PageHeading } from '../../../../../components/page-heading'
import { Stack } from '../../../../../components/stack'
import { title } from '../../../../../helpers/dom'
import { RecipeSchema } from '../../../../../types/recipes'

export const Route = createFileRoute('/recipes/$category/$subcategory/$recipe/_private/edit')({
  component: RouteComponent,
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: title([
            'Editing',
            loaderData?.recipe?.title,
            loaderData?.subcategory?.title,
            loaderData?.category?.title,
          ]),
        },
      ],
    }
  },
  loader: async ({ params }) => {
    const { category: categorySlug, recipe: recipeSlug, subcategory: subcategorySlug } = params
    const category = await getCategoryBySlug(categorySlug)
    const subcategory = await getSubcategoryBySlug(subcategorySlug)
    const recipe = await getRecipeBySlug({
      categoryId: category.id,
      slug: recipeSlug,
      subcategoryId: subcategory.id,
    })
    const categories = await getCategories()
    const subcategories = await getSubcategories()

    return {
      categories,
      category,
      recipe,
      subcategories,
      subcategory,
    }
  },
})

function RouteComponent() {
  const {
    category: categorySlug,
    recipe: recipeSlug,
    subcategory: subcategorySlug,
  } = Route.useParams()
  const formRef = useRef<HTMLFormElement>(null)
  const { categories, recipe, subcategories } = Route.useLoaderData()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<number>(recipe.category_id)
  const subcategoriesByCategory = subcategories.filter((subcategory) => {
    // The category list is empty until a category is selected
    if (!selectedCategory) return false

    return subcategory.category_id === selectedCategory
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = new FormData(e.currentTarget)
      const {
        category_id,
        directions_md,
        id,
        ingredients_md,
        rating,
        source,
        subcategory_id,
        title,
      } = Object.fromEntries(data)

      const partialRecipe = RecipeSchema.partial().parse({
        category_id: Number(category_id),
        dietary_pref: [],
        directions_md,
        id: Number(id),
        ingredients_md,
        rating: Number(rating),
        source,
        subcategory_id: Number(subcategory_id),
        title,
      })

      await updateRecipe(partialRecipe)

      // Clear the form
      formRef.current?.reset()

      toast.success(`Recipe ${title} updated`)
      router.invalidate()
    } catch (err) {
      toast.error(String(err))

      throw err
    }
  }

  return (
    <div>
      <PageHeader>
        <PageHeading>Editing {recipe.title}</PageHeading>

        <PageActions>
          <PageBackLink
            params={{
              category: categorySlug,
              recipe: recipeSlug,
              subcategory: subcategorySlug,
            }}
            to="/recipes/$category/$subcategory/$recipe/view"
          >
            Back to recipe
          </PageBackLink>

          {/** TODO: This should only render for admins */}
          <PageDeleteButton>Delete</PageDeleteButton>
        </PageActions>
      </PageHeader>

      <PageBody>
        <form onSubmit={handleSubmit} ref={formRef}>
          <Stack>
            <div className="bg-slate-100 rounded-xl w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Stack>
                <input name="id" type="hidden" value={recipe.id} />

                <FormControl>
                  <FormLabel htmlFor="title-input">Title</FormLabel>
                  <FormInput defaultValue={recipe.title} id="title-input" name="title" required />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="category-select">Category</FormLabel>
                  <FormSelect
                    defaultValue={recipe.category_id}
                    id="category-select"
                    name="category_id"
                    onChange={(e) => {
                      const categoryId = Number((e.target as HTMLSelectElement).value)

                      if (!categoryId) return

                      setSelectedCategory(categoryId)
                    }}
                    required
                  >
                    <option disabled value="">
                      Select category
                    </option>

                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.emoji} {category.title}
                        </option>
                      )
                    })}
                  </FormSelect>
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="subcategory-select">Subcategory</FormLabel>
                  <FormSelect
                    defaultValue={recipe.subcategory_id}
                    disabled={subcategoriesByCategory.length === 0}
                    id="subcategory-select"
                    name="subcategory_id"
                    required
                  >
                    <option disabled value="">
                      Select subcategory
                    </option>

                    {subcategoriesByCategory.map((subcategory) => {
                      return (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.emoji} {subcategory.title}
                        </option>
                      )
                    })}
                  </FormSelect>
                </FormControl>
              </Stack>

              <Stack>
                <FormControl>
                  <FormLabel htmlFor="rating-select">Rating</FormLabel>
                  <FormSelect defaultValue={recipe.rating} id="rating-select" name="rating">
                    <option disabled value="">
                      Select rating
                    </option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                  </FormSelect>
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="source-input">Source</FormLabel>
                  <FormInput defaultValue={recipe.source} id="source-input" name="source" />
                </FormControl>
              </Stack>
            </div>

            <FormControl>
              <FormLabel htmlFor="ingredients-textarea">Ingredients</FormLabel>
              <FormTextarea
                defaultValue={recipe.ingredients_md}
                id="ingredients-textarea"
                name="ingredients_md"
                required
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="directions-textarea">Directions</FormLabel>
              <FormTextarea
                defaultValue={recipe.directions_md}
                id="directions-textarea"
                name="directions_md"
                required
                rows={4}
              />
            </FormControl>

            <Button type="submit">Save recipe</Button>
          </Stack>
        </form>
      </PageBody>
    </div>
  )
}
