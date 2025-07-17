import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import * as v from 'valibot'
import { getCategories } from '../../api/categories'
import { addRecipe } from '../../api/recipes'
import { getSubcategories } from '../../api/subcategories'
import { Button } from '../../components/button'
import { FormControl } from '../../components/form-control'
import { FormInput } from '../../components/form-input'
import { FormLabel } from '../../components/form-label'
import { FormSelect } from '../../components/form-select'
import { FormTextarea } from '../../components/form-textarea'
import { PageBody } from '../../components/page-body'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { Stack } from '../../components/stack'
import { title } from '../../helpers/dom'
import { slugify } from '../../helpers/string'
import { NewRecipeSchema } from '../../types/recipes'

export const Route = createFileRoute('/recipes/_private/add')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: title(['Add recipe', 'Recipes']),
      },
    ],
  }),
  loader: async () => {
    const categories = await getCategories()
    const subcategories = await getSubcategories()

    return { categories, subcategories }
  },
})

function RouteComponent() {
  const [addReqStatus, setAddReqStatus] = useState<'loading' | 'idle'>('idle')
  const [selectedCategory, setSelectedCategory] = useState<number>()
  const formRef = useRef<HTMLFormElement>(null)
  const { categories, subcategories } = Route.useLoaderData()
  const subcategoriesByCategory = subcategories.filter((subcategory) => {
    // The category list is empty until a category is selected
    if (!selectedCategory) return false

    return subcategory.category_id === selectedCategory
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = new FormData(e.currentTarget)
      const { category_id, directions_md, ingredients_md, rating, source, subcategory_id, title } =
        Object.fromEntries(data)

      const newRecipe = v.parse(NewRecipeSchema, {
        category_id: Number(category_id),
        dietary_pref: [],
        directions_md,
        ingredients_md,
        rating: Number(rating),
        slug: slugify(String(title)),
        source,
        subcategory_id: Number(subcategory_id),
        title,
      })

      setAddReqStatus('loading')

      await addRecipe(newRecipe)

      setAddReqStatus('idle')

      // Clear the form
      formRef.current?.reset()

      // Toast it up
      toast.success(`Recipe "${title}" added`)
    } catch (err) {
      toast.error(String(err))
      setAddReqStatus('idle')

      throw err
    }
  }

  return (
    <div>
      <PageHeader>
        <PageHeading>Add recipe</PageHeading>
      </PageHeader>

      <PageBody>
        <form onSubmit={handleSubmit} ref={formRef}>
          <Stack>
            <div className="bg-slate-100 rounded-xl w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Stack>
                <FormControl>
                  <FormLabel htmlFor="title-input">Title</FormLabel>
                  <FormInput id="title-input" name="title" required />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="category-select">Category</FormLabel>
                  <FormSelect
                    defaultValue=""
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
                    defaultValue=""
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
                  <FormSelect defaultValue="" id="rating-select" name="rating">
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
                  <FormInput id="source-input" name="source" />
                </FormControl>
              </Stack>
            </div>

            <FormControl>
              <FormLabel htmlFor="ingredients-textarea">Ingredients</FormLabel>
              <FormTextarea id="ingredients-textarea" name="ingredients_md" required rows={4} />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="directions-textarea">Directions</FormLabel>
              <FormTextarea id="directions-textarea" name="directions_md" required rows={4} />
            </FormControl>

            <Button loading={addReqStatus === 'loading'} type="submit">
              Add recipe
            </Button>
          </Stack>
        </form>
      </PageBody>
    </div>
  )
}
