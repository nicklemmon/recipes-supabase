import { describe, it, expect } from 'vitest'
import { toRecipeRouteParams } from '../recipes'
import { Category } from '../../types/categories'
import { SubCategory } from '../../types/subcategories'

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

const RECIPE = {
  slug: 'chocolate-chip-cookies',
  category_id: 1,
  subcategory_id: 10,
}

describe('toRecipeRouteParams', () => {
  it('returns the slugs for the recipe, its category, and its subcategory', () => {
    expect(
      toRecipeRouteParams({
        recipe: RECIPE,
        categories: CATEGORIES,
        subcategories: SUBCATEGORIES,
      }),
    ).toEqual({
      category: 'desserts',
      subcategory: 'cookies',
      recipe: 'chocolate-chip-cookies',
    })
  })

  it('returns undefined when the category is missing', () => {
    expect(
      toRecipeRouteParams({
        recipe: { ...RECIPE, category_id: 999 },
        categories: CATEGORIES,
        subcategories: SUBCATEGORIES,
      }),
    ).toBeUndefined()
  })

  it('returns undefined when the subcategory is missing', () => {
    expect(
      toRecipeRouteParams({
        recipe: { ...RECIPE, subcategory_id: 999 },
        categories: CATEGORIES,
        subcategories: SUBCATEGORIES,
      }),
    ).toBeUndefined()
  })

  it('returns undefined when the lists are empty', () => {
    expect(
      toRecipeRouteParams({ recipe: RECIPE, categories: [], subcategories: [] }),
    ).toBeUndefined()
  })
})
