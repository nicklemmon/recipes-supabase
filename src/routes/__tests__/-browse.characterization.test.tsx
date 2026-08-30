import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test-helpers/render-route'
import { title } from '../../helpers/dom'

describe('Browse characterization', () => {
  it('home lists categories and a Favorites entry', async () => {
    await renderRoute('/')

    expect(await screen.findByRole('heading', { name: 'Categories' })).toBeInTheDocument()
    expect(await screen.findByText('Desserts')).toBeInTheDocument()
    expect(screen.getByText('Dinner')).toBeInTheDocument()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
  })

  it('category page lists subcategories', async () => {
    await renderRoute('/recipes/desserts')

    expect(await screen.findByRole('heading', { name: 'Desserts' })).toBeInTheDocument()
    expect(await screen.findByText('Cookies')).toBeInTheDocument()
    expect(screen.queryByText('Pasta')).not.toBeInTheDocument()
  })

  it('subcategory page lists recipe titles', async () => {
    await renderRoute('/recipes/desserts/cookies')

    expect(await screen.findByRole('heading', { name: 'Cookies' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Chocolate Chip Cookies' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sugar Cookies' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Spaghetti' })).not.toBeInTheDocument()
  })

  it('recipe view shows title and body content', async () => {
    await renderRoute('/recipes/desserts/cookies/chocolate-chip-cookies/view')

    expect(
      await screen.findByRole('heading', { name: 'Chocolate Chip Cookies' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Flour/)).toBeInTheDocument()
    expect(screen.getByText(/Mix and bake/)).toBeInTheDocument()
  })

  it('sets the document title from recipe head data', async () => {
    await renderRoute('/recipes/desserts/cookies/chocolate-chip-cookies/view')

    await screen.findByRole('heading', { name: 'Chocolate Chip Cookies' })

    await waitFor(() => {
      expect(document.title).toBe(title(['Chocolate Chip Cookies', 'Cookies', 'Desserts']))
    })
  })

  it('list search shows matching recipe titles for s', async () => {
    await renderRoute('/recipes/list?s=chip')

    expect(await screen.findByRole('heading', { name: 'Recipes' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Chocolate Chip Cookies' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Sugar Cookies' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Spaghetti' })).not.toBeInTheDocument()
  })

  it('favorites shows only favorite recipes', async () => {
    await renderRoute('/recipes/favorites')

    expect(await screen.findByRole('heading', { name: 'Favorites' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Chocolate Chip Cookies' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Sugar Cookies' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Spaghetti' })).not.toBeInTheDocument()
  })

  it('deleting a recipe navigates to the subcategory list without that recipe', async () => {
    const { router } = await renderRoute('/recipes/desserts/cookies/chocolate-chip-cookies/view')

    await screen.findByRole('heading', { name: 'Chocolate Chip Cookies' })

    // fireEvent avoids vaul pointer-up path issues in happy-dom
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    const dialog = await screen.findByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/recipes/desserts/cookies')
    })

    expect(await screen.findByRole('heading', { name: 'Cookies' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Chocolate Chip Cookies' })).not.toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Sugar Cookies' })).toBeInTheDocument()
  })
})
