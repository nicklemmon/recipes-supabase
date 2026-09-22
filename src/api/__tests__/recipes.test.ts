import { describe, expect, it } from 'vitest'
import { getRecipes } from '../recipes'

describe('getRecipes', () => {
  it('filters by category alone', async () => {
    const recipes = await getRecipes({ categoryId: 2 })

    expect(recipes.map((recipe) => recipe.title)).toEqual(['Spaghetti'])
  })

  it('filters by category and subcategory together', async () => {
    const recipes = await getRecipes({ categoryId: 1, subcategoryId: 10 })

    expect(recipes.map((recipe) => recipe.title)).toEqual([
      'Chocolate Chip Cookies',
      'Sugar Cookies',
    ])
  })
})
