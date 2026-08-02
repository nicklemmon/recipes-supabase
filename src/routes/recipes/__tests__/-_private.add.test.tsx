import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Category } from '../../../types/categories'
import { SubCategory } from '../../../types/subcategories'

const { navigate, addRecipe } = vi.hoisted(() => ({
  navigate: vi.fn(),
  addRecipe: vi.fn(),
}))

// The route component is rendered on its own, so the router is stubbed down to the two pieces it
// uses: the loader data and `navigate`.
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    ...options,
    useLoaderData: () => LOADER_DATA,
  }),
  useRouter: () => ({ navigate }),
}))

vi.mock('../../../api/recipes', () => ({ addRecipe }))
vi.mock('../../../api/categories', () => ({ getCategories: vi.fn() }))
vi.mock('../../../api/subcategories', () => ({ getSubcategories: vi.fn() }))
vi.mock('../../../api/dietary-preferences', () => ({ getDietaryPreferences: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const CATEGORIES: Category[] = [
  { id: 1, created_at: '2026-01-01', title: 'Desserts', emoji: '🍰', slug: 'desserts' },
  { id: 2, created_at: '2026-01-01', title: 'Dinner', emoji: '🍽️', slug: 'dinner' },
]

const SUBCATEGORIES: SubCategory[] = [
  {
    id: 10,
    created_at: '2026-01-01',
    title: 'Cookies',
    emoji: '🍪',
    slug: 'cookies',
    category_id: 1,
  },
  {
    id: 20,
    created_at: '2026-01-01',
    title: 'Pasta',
    emoji: '🍝',
    slug: 'pasta',
    category_id: 2,
  },
]

const LOADER_DATA = {
  categories: CATEGORIES,
  subcategories: SUBCATEGORIES,
  dietaryPreferences: [{ id: 1, created_at: '2026-01-01', label: 'Vegan', slug: 'vegan' }],
}

const ADDED_RECIPE = {
  id: 100,
  created_at: '2026-01-01',
  title: 'Chocolate Chip Cookies',
  slug: 'chocolate-chip-cookies',
  category_id: 1,
  subcategory_id: 10,
  ingredients_md: 'Flour',
  directions_md: 'Bake',
  dietary_pref: [],
  rating: null,
}

const { Route } = await import('../_private.add')

const AddRecipeRoute = (Route as unknown as { component: () => React.JSX.Element }).component

async function fillOutForm() {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText('Title'), 'Chocolate Chip Cookies')
  // The subcategory select stays disabled until a category is picked
  await user.selectOptions(screen.getByLabelText('Category'), '1')
  await user.selectOptions(screen.getByLabelText('Subcategory'), '10')
  await user.type(screen.getByLabelText('Ingredients'), 'Flour')
  await user.type(screen.getByLabelText('Directions'), 'Bake')
  await user.click(screen.getByRole('button', { name: 'Add recipe' }))
}

describe('Add recipe route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    addRecipe.mockResolvedValue(ADDED_RECIPE)
  })

  it('redirects to the new recipe after it is added', async () => {
    render(<AddRecipeRoute />)

    await fillOutForm()

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({
        to: '/recipes/$category/$subcategory/$recipe/view',
        params: {
          category: 'desserts',
          subcategory: 'cookies',
          recipe: 'chocolate-chip-cookies',
        },
      })
    })
  })

  it('does not redirect when the added recipe cannot be matched to a category', async () => {
    addRecipe.mockResolvedValue({ ...ADDED_RECIPE, category_id: 999 })

    render(<AddRecipeRoute />)

    await fillOutForm()

    await waitFor(() => expect(addRecipe).toHaveBeenCalled())
    expect(navigate).not.toHaveBeenCalled()
  })

  it('does not redirect when adding the recipe fails', async () => {
    // The submit handler re-throws after toasting, which lands as an unhandled rejection
    const ignoreRejection = () => {}
    process.on('unhandledRejection', ignoreRejection)

    addRecipe.mockRejectedValue(new Error('Insert failed'))

    render(<AddRecipeRoute />)

    await fillOutForm()

    await waitFor(() => expect(addRecipe).toHaveBeenCalled())
    expect(navigate).not.toHaveBeenCalled()

    process.off('unhandledRejection', ignoreRejection)
  })
})
