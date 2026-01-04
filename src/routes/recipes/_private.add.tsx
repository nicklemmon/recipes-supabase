import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { PageBody } from '../../components/page-body'
import { title } from '../../helpers/dom'
import { slugify } from '../../helpers/string'
import { NewRecipeSchema } from '../../types/recipes'
import { getCategories } from '../../api/categories'
import { getSubcategories } from '../../api/subcategories'
import { Stack } from '../../components/stack'
import { FormControl } from '../../components/form-control'
import { FormLabel } from '../../components/form-label'
import { FormInput } from '../../components/form-input'
import { Button } from '../../components/button'
import { FormSelect } from '../../components/form-select'
import { FormTextarea } from '../../components/form-textarea'
import { addRecipe } from '../../api/recipes'

export const Route = createFileRoute('/recipes/_private/add')({
  head: () => ({
    meta: [
      {
        title: title(['Add recipe', 'Recipes']),
      },
    ],
  }),
  component: RouteComponent,
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
      const { title, source, category_id, rating, subcategory_id, ingredients_md, directions_md } =
        Object.fromEntries(data)

      const newRecipe = NewRecipeSchema.parse({
        title,
        slug: slugify(String(title)),
        source,
        category_id: Number(category_id),
        rating: Number(rating),
        subcategory_id: Number(subcategory_id),
        ingredients_md,
        directions_md,
        dietary_pref: [],
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
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Stack>
                <FormControl>
                  <FormLabel htmlFor="title-input">Title</FormLabel>
                  <FormInput id="title-input" name="title" required />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="category-select">Category</FormLabel>
                  <FormSelect
                    id="category-select"
                    name="category_id"
                    defaultValue=""
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
                    id="subcategory-select"
                    name="subcategory_id"
                    defaultValue=""
                    required
                    disabled={subcategoriesByCategory.length === 0}
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
                  <FormSelect id="rating-select" name="rating" defaultValue="">
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
              <FormTextarea id="ingredients-textarea" name="ingredients_md" rows={4} required />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="directions-textarea">Directions</FormLabel>
              <FormTextarea id="directions-textarea" name="directions_md" rows={4} required />
            </FormControl>

            <Button type="submit" loading={addReqStatus === 'loading'}>
              Add recipe
            </Button>
          </Stack>
        </form>
      </PageBody>
    </div>
  )
}
