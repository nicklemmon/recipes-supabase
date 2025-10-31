import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import DOMPurify from 'dompurify'
import { Star } from 'lucide-react'
import markdownit from 'markdown-it'
import { useState } from 'react'
import { toast } from 'sonner'
import { Drawer } from 'vaul'
import { z } from 'zod'

import { getCategoryBySlug } from '../../../../../api/categories'
import { deleteRecipe, getRecipeBySlug } from '../../../../../api/recipes'
import { getSubcategoryBySlug } from '../../../../../api/subcategories'
import { Button } from '../../../../../components/button'
import { Container } from '../../../../../components/container'
import { FormControl } from '../../../../../components/form-control'
import { FormLabel } from '../../../../../components/form-label'
import { Inline } from '../../../../../components/inline'
import {
  PageActions,
  PageBackLink,
  PageDeleteButton,
  PageEditLink,
} from '../../../../../components/page-actions'
import { PageBody } from '../../../../../components/page-body'
import { PageHeader } from '../../../../../components/page-header'
import { PageHeading } from '../../../../../components/page-heading'
import { Stack } from '../../../../../components/stack'
import { Switch } from '../../../../../components/switch'
import { DEVICE_CAN_SLEEP } from '../../../../../constants/device'
import { toLegibleDate } from '../../../../../helpers/date'
import { allowSleep, preventSleep } from '../../../../../helpers/device'
import { title } from '../../../../../helpers/dom'

const md = markdownit({
  breaks: true,
})

const SearchSchema = z.object({
  from: z.string().default('category'),
})

export const Route = createFileRoute('/recipes/$category/$subcategory/$recipe/view')({
  component: RouteComponent,
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: title([
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

    return {
      category,
      recipe,
      subcategory,
    }
  },
  validateSearch: SearchSchema,
})

function RouteComponent() {
  const { category: categorySlug, subcategory: subcategorySlug } = Route.useParams()
  const { recipe, subcategory } = Route.useLoaderData()
  const { from } = Route.useSearch()
  const [delStatus, setDelStatus] = useState<'idle' | 'pending'>('idle')
  const navigate = useNavigate()
  const router = useRouter()
  const ingredients = md.render(recipe.ingredients_md)
  const directions = md.render(recipe.directions_md)

  /** Handles recipe deletion */
  const handleDelete = async (recipeId: number, recipeTitle: string) => {
    try {
      setDelStatus('pending')

      await deleteRecipe(recipeId)

      setDelStatus('idle')

      toast.success(`Successfully deleted "${recipeTitle}"`)

      await router.invalidate()

      await navigate({
        params: {
          category: categorySlug,
          subcategory: subcategorySlug,
        },
        to: '/recipes/$category/$subcategory',
      })
    } catch (err) {
      setDelStatus('idle')

      toast.error('Failed to delete recipe')

      throw err
    }
  }

  const handleSleepToggle = async (checked: boolean) => {
    if (checked) {
      return await preventSleep()
    }

    return await allowSleep()
  }

  return (
    <div>
      <PageHeader>
        <PageHeading>{recipe.title}</PageHeading>

        <PageActions>
          <div className="w-full">
            {from === 'favorites' ? (
              <PageBackLink to="/recipes/favorites">Back to favorites</PageBackLink>
            ) : (
              <PageBackLink
                params={{
                  category: categorySlug,
                  subcategory: subcategorySlug,
                }}
                to="/recipes/$category/$subcategory"
              >
                Back to {subcategory.title}
              </PageBackLink>
            )}
          </div>

          <Stack align="right">
            {DEVICE_CAN_SLEEP ? (
              <FormControl className="items-end">
                <FormLabel htmlFor="prevent-sleep-toggle">Cooking mode</FormLabel>
                <Switch id="prevent-sleep-toggle" onCheckedChange={handleSleepToggle} />
              </FormControl>
            ) : null}

            <Inline spacing="sm">
              <PageEditLink
                params={{
                  category: categorySlug,
                  recipe: recipe.slug,
                  subcategory: subcategorySlug,
                }}
                to="/recipes/$category/$subcategory/$recipe/edit"
              >
                Edit
              </PageEditLink>

              <Drawer.Root>
                <Drawer.Trigger asChild>
                  <PageDeleteButton>Delete</PageDeleteButton>
                </Drawer.Trigger>

                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-lg" />
                  <Drawer.Content className="bg-gray-100 fixed bottom-0 left-0 right-0 outline-none">
                    <div className="h-[85vh] md:h-[50vh] py-8 bg-white">
                      <Container>
                        <Stack>
                          <Drawer.Title asChild>
                            <h3 className="font-bold text-slate-800 text-xl">Confirm deletion</h3>
                          </Drawer.Title>

                          <p className="text-slate-600">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold">{recipe.title}</span>? This cannot be
                            undone.
                          </p>

                          <Inline spacing="sm">
                            <Button
                              loading={delStatus === 'pending'}
                              onClick={() => handleDelete(recipe.id, recipe.title)}
                            >
                              Delete
                            </Button>

                            <Drawer.Close asChild>
                              <Button disabled={delStatus === 'pending'} variant="secondary">
                                Cancel
                              </Button>
                            </Drawer.Close>
                          </Inline>
                        </Stack>
                      </Container>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </Inline>
          </Stack>
        </PageActions>
      </PageHeader>

      <PageBody>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
          <div>
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
          </div>

          <div>
            <div className="rounded-xl bg-slate-100 text-slate-700 p-4">
              <Stack spacing="sm">
                <Stack spacing="xs">
                  <div className="text-md font-semibold text-slate-900">Source</div>
                  <div className="text-slate-600">{recipe.source}</div>
                </Stack>

                <Stack spacing="xs">
                  <div className="text-md font-semibold text-slate-900">Rating</div>
                  <div className="text-slate-600">
                    <Inline spacing="xs">
                      {[...new Array(recipe.rating)].map((_star, index) => (
                        <Star
                          className="text-yellow-500 fill-yellow-200"
                          key={`${recipe.id}-start-${index}`}
                          size={16}
                        />
                      ))}
                    </Inline>
                  </div>
                </Stack>

                <Stack spacing="xs">
                  <div className="text-md font-semibold text-slate-900">Created at</div>
                  <div className="text-slate-600">{toLegibleDate(recipe.created_at)}</div>
                </Stack>

                {recipe.dietary_pref.length > 0 ? (
                  <Stack spacing="xs">
                    <div className="text-md font-semibold text-slate-900">Dietary preferences</div>
                    <div className="text-slate-600">{recipe.dietary_pref.map((pref) => pref)}</div>
                  </Stack>
                ) : null}
              </Stack>
            </div>
          </div>
        </div>
      </PageBody>
    </div>
  )
}
