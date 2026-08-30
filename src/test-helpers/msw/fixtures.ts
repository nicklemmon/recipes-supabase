import type { Category } from '../../types/categories'
import type { DietaryPreference } from '../../types/dietary-preferences'
import type { Recipe } from '../../types/recipes'
import type { SubCategory } from '../../types/subcategories'

export const CATEGORIES: Category[] = [
  { id: 1, created_at: '2026-01-01T00:00:00Z', title: 'Desserts', emoji: '🍰', slug: 'desserts' },
  { id: 2, created_at: '2026-01-01T00:00:00Z', title: 'Dinner', emoji: '🍽️', slug: 'dinner' },
]

export const SUBCATEGORIES: SubCategory[] = [
  {
    id: 10,
    created_at: '2026-01-01T00:00:00Z',
    title: 'Cookies',
    emoji: '🍪',
    slug: 'cookies',
    category_id: 1,
  },
  {
    id: 20,
    created_at: '2026-01-01T00:00:00Z',
    title: 'Pasta',
    emoji: '🍝',
    slug: 'pasta',
    category_id: 2,
  },
]

export const DIETARY_PREFERENCES: DietaryPreference[] = [
  {
    id: 1,
    created_at: '2026-01-01T00:00:00Z',
    slug: 'vegan',
    label: 'Vegan',
    category: 'diet',
    description: null,
  },
]

export const RECIPES: Recipe[] = [
  {
    id: 100,
    created_at: '2026-01-01T00:00:00Z',
    title: 'Chocolate Chip Cookies',
    slug: 'chocolate-chip-cookies',
    category_id: 1,
    subcategory_id: 10,
    ingredients_md: 'Flour\nSugar\nChocolate chips',
    directions_md: 'Mix and bake',
    dietary_pref: ['vegan'],
    rating: 5,
  },
  {
    id: 101,
    created_at: '2026-01-01T00:00:00Z',
    title: 'Sugar Cookies',
    slug: 'sugar-cookies',
    category_id: 1,
    subcategory_id: 10,
    ingredients_md: 'Flour\nSugar',
    directions_md: 'Roll and bake',
    dietary_pref: [],
    rating: 3,
  },
  {
    id: 200,
    created_at: '2026-01-01T00:00:00Z',
    title: 'Spaghetti',
    slug: 'spaghetti',
    category_id: 2,
    subcategory_id: 20,
    ingredients_md: 'Pasta\nSauce',
    directions_md: 'Boil and serve',
    dietary_pref: [],
    rating: null,
  },
]
