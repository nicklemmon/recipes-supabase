import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { RecipeSchema } from '../../../../../types/recipes'
import { PageBody } from '../../../../../components/page-body'
import { PageHeader } from '../../../../../components/page-header'
import { PageHeading } from '../../../../../components/page-heading'
import { PageActions, PageBackLink, PageDeleteButton } from '../../../../../components/page-actions'
import { getCategoryBySlug } from '../../../../../api/categories'
import { getSubcategoryBySlug } from '../../../../../api/subcategories'
import { getCategories } from '../../../../../api/categories'
import { getSubcategories } from '../../../../../api/subcategories'
import { getRecipeBySlug, updateRecipe } from '../../../../../api/recipes'
import { getDietaryPreferences } from '../../../../../api/dietary-preferences'
import { title } from '../../../../../helpers/dom'
import { toDietaryPrefOptions } from '../../../../../helpers/dietary-preferences'
import { Stack } from '../../../../../components/stack'
import { FormControl } from '../../../../../components/form-control'
import { FormLabel } from '../../../../../components/form-label'
import { FormInput } from '../../../../../components/form-input'
import { Button } from '../../../../../components/button'
import { FormSelect } from '../../../../../components/form-select'
import { FormTextarea } from '../../../../../components/form-textarea'
import { FormCombobox } from '../../../../../components/form-combobox'

export const Route = createFileRoute('/recipes/$category/$subcategory/$recipe/_private/edit')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { subcategory: subcategorySlug, category: categorySlug, recipe: recipeSlug } = params
    const [category, subcategory, categories, subcategories, dietaryPreferences] =
      await Promise.all([
        getCategoryBySlug(categorySlug),
        getSubcategoryBySlug(subcategorySlug),
        getCategories(),
        getSubcategories(),
        getDietaryPreferences(),
      ])
    const recipe = await getRecipeBySlug({
      slug: recipeSlug,
      categoryId: category.id,
      subcategoryId: subcategory.id,
    })

    return {
      category,
      subcategory,
      recipe,
      categories,
      subcategories,
      dietaryPreferences,
    }
  },
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
})

function RouteComponent() {
  const {
    recipe: recipeSlug,
    subcategory: subcategorySlug,
    category: categorySlug,
  } = Route.useParams()
  const { recipe, categories, subcategories, dietaryPreferences } = Route.useLoaderData()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<number>(recipe.category_id)
  const [selectedDietaryPrefs, setSelectedDietaryPrefs] = useState<string[]>(recipe.dietary_pref)
  const [updateReqStatus, setUpdateReqStatus] = useState<'loading' | 'idle'>('idle')
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
        id,
        title,
        source,
        category_id,
        rating,
        subcategory_id,
        ingredients_md,
        directions_md,
      } = Object.fromEntries(data)

      const partialRecipe = RecipeSchema.partial().parse({
        id: Number(id),
        title,
        source,
        category_id: Number(category_id),
        rating: Number(rating),
        subcategory_id: Number(subcategory_id),
        ingredients_md,
        directions_md,
        dietary_pref: selectedDietaryPrefs,
      })

      setUpdateReqStatus('loading')

      await updateRecipe(partialRecipe)

      toast.success(`Recipe ${title} updated`)

      // Navigate back to the view page after successful update
      router.navigate({
        to: '/recipes/$category/$subcategory/$recipe/view',
        params: {
          recipe: recipeSlug,
          category: categorySlug,
          subcategory: subcategorySlug,
        },
      })
    } catch (err) {
      toast.error(String(err))
      setUpdateReqStatus('idle')

      throw err
    }
  }

  return (
    <div>
      <PageHeader>
        <PageHeading>Editing {recipe.title}</PageHeading>

        <PageActions>
          <PageBackLink
            to="/recipes/$category/$subcategory/$recipe/view"
            params={{
              recipe: recipeSlug,
              category: categorySlug,
              subcategory: subcategorySlug,
            }}
          >
            Back to recipe
          </PageBackLink>

          {/** TODO: This should only render for admins */}
          <PageDeleteButton>Delete</PageDeleteButton>
        </PageActions>
      </PageHeader>

      <PageBody>
        <form onSubmit={handleSubmit}>
          <Stack>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Stack>
                <input type="hidden" name="id" value={recipe.id} />

                <FormControl>
                  <FormLabel htmlFor="title-input">Title</FormLabel>
                  <FormInput
                    id="title-input"
                    name="title"
                    required
                    defaultValue={recipe.title}
                    disabled={updateReqStatus === 'loading'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="category-select">Category</FormLabel>
                  <FormSelect
                    id="category-select"
                    name="category_id"
                    defaultValue={recipe.category_id}
                    onChange={(e) => {
                      const categoryId = Number((e.target as HTMLSelectElement).value)

                      if (!categoryId) return

                      setSelectedCategory(categoryId)
                    }}
                    required
                    disabled={updateReqStatus === 'loading'}
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
                    id="subcategory-select"
                    name="subcategory_id"
                    defaultValue={recipe.subcategory_id}
                    required
                    disabled={subcategoriesByCategory.length === 0 || updateReqStatus === 'loading'}
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
                  <FormSelect
                    id="rating-select"
                    name="rating"
                    defaultValue={recipe.rating}
                    disabled={updateReqStatus === 'loading'}
                  >
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
                  <FormInput
                    id="source-input"
                    name="source"
                    defaultValue={recipe.source}
                    disabled={updateReqStatus === 'loading'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Dietary preferences</FormLabel>
                  <FormCombobox
                    options={toDietaryPrefOptions(dietaryPreferences)}
                    value={selectedDietaryPrefs}
                    onValueChange={setSelectedDietaryPrefs}
                    placeholder="Select preferences..."
                  />
                </FormControl>
              </Stack>
            </div>

            <FormControl>
              <FormLabel htmlFor="ingredients-textarea">Ingredients</FormLabel>
              <FormTextarea
                id="ingredients-textarea"
                name="ingredients_md"
                rows={4}
                required
                defaultValue={recipe.ingredients_md}
                disabled={updateReqStatus === 'loading'}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="directions-textarea">Directions</FormLabel>
              <FormTextarea
                id="directions-textarea"
                name="directions_md"
                rows={4}
                required
                defaultValue={recipe.directions_md}
                disabled={updateReqStatus === 'loading'}
              />
            </FormControl>

            <Button type="submit" loading={updateReqStatus === 'loading'}>
              Save recipe
            </Button>
          </Stack>
        </form>
      </PageBody>
    </div>
  )
}
