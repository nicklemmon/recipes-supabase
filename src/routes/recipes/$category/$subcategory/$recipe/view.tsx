import { createFileRoute, Link, Outlet, useNavigate, useRouter } from '@tanstack/react-router'
import markdownit from 'markdown-it'
import { Star } from 'lucide-react'
import { useState } from 'react'
import { Drawer } from 'vaul'
import DOMPurify from 'dompurify'
import { toast } from 'sonner'
import { getCategoryBySlug } from '../../../../../api/categories'
import { getSubcategoryBySlug } from '../../../../../api/subcategories'
import { deleteRecipe, getRecipeBySlug } from '../../../../../api/recipes'
import { title } from '../../../../../helpers/dom'
import { Inline } from '../../../../../components/inline'
import {
  PageActions,
  PageBackLink,
  PageDeleteButton,
  PageEditLink,
} from '../../../../../components/page-actions'
import { Button } from '../../../../../components/button'
import { Container } from '../../../../../components/container'
import { PageBody } from '../../../../../components/page-body'
import { PageHeader } from '../../../../../components/page-header'
import { PageHeading } from '../../../../../components/page-heading'
import { Stack } from '../../../../../components/stack'
import { toLegibleDate } from '../../../../../helpers/date'
import { ModalDialog } from '../../../../../components/modal-dialog'

const md = markdownit()

export const Route = createFileRoute('/recipes/$category/$subcategory/$recipe/view')({
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
})

function RouteComponent() {
  const { subcategory: subcategorySlug, category: categorySlug } = Route.useParams()
  const { recipe, subcategory } = Route.useLoaderData()
  const [delStatus, setDelStatus] = useState<'pending' | 'idle'>('idle')
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
        to: '/recipes/$category/$subcategory',
        params: {
          category: categorySlug,
          subcategory: subcategorySlug,
        },
      })
    } catch (err) {
      setDelStatus('idle')

      toast.error('Failed to delete recipe')

      throw err
    }
  }

  return (
    <div>
      <PageHeader>
        <PageHeading>{recipe.title}</PageHeading>

        <PageActions>
          <PageBackLink
            to="/recipes/$category/$subcategory"
            params={{
              category: categorySlug,
              subcategory: subcategorySlug,
            }}
          >
            Back to {subcategory.title}
          </PageBackLink>

          <Inline>
            <PageEditLink
              to="/recipes/$category/$subcategory/$recipe/edit"
              params={{
                category: categorySlug,
                subcategory: subcategorySlug,
                recipe: recipe.slug,
              }}
            >
              Edit
            </PageEditLink>

            {/** TODO: This should only render for admins */}

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
                            onClick={() => handleDelete(recipe.id, recipe.title)}
                            loading={delStatus === 'pending'}
                          >
                            Delete
                          </Button>

                          <Drawer.Close asChild>
                            <Button variant="secondary" disabled={delStatus === 'pending'}>
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
                          key={`${recipe.id}-start-${index}`}
                          size={16}
                          className="text-yellow-500 fill-yellow-200"
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
