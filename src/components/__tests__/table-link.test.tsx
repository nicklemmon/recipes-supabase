import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TableLink } from '../table-link'
import { renderWithRouter } from '../../test-helpers/render-with-router'

describe('TableLink', () => {
  it('renders with children', async () => {
    renderWithRouter(<TableLink to="/recipes">Test Recipe</TableLink>)
    expect(await screen.findByRole('link')).toHaveTextContent('Test Recipe')
  })

  it('applies base styles', async () => {
    renderWithRouter(<TableLink to="/recipes">Recipe</TableLink>)
    const link = await screen.findByRole('link')
    expect(link).toHaveClass('text-indigo-600', 'dark:text-indigo-400', 'font-medium')
  })

  it('glues the chevron to the text with a non-breaking space', async () => {
    renderWithRouter(<TableLink to="/recipes">Recipe</TableLink>)
    const link = await screen.findByRole('link')
    expect(link.textContent).toBe(`Recipe\u00A0`)
  })

  it('shows the chevron by default', async () => {
    renderWithRouter(<TableLink to="/recipes">Recipe</TableLink>)
    await screen.findByRole('link')
    const chevron = document.querySelector('svg')
    expect(chevron).not.toHaveClass('hidden')
  })

  it('hides the chevron below md when hideChevronOnMobile is set', async () => {
    renderWithRouter(
      <TableLink to="/recipes" hideChevronOnMobile>
        Recipe
      </TableLink>,
    )
    await screen.findByRole('link')
    const chevron = document.querySelector('svg')
    expect(chevron).toHaveClass('hidden', 'md:inline-block')
  })

  it('accepts custom className', async () => {
    renderWithRouter(
      <TableLink to="/recipes" className="custom-class">
        Recipe
      </TableLink>,
    )
    const link = await screen.findByRole('link')
    expect(link).toHaveClass('custom-class', 'text-indigo-600')
  })

  it('builds an href from the to and params props', async () => {
    renderWithRouter(
      <TableLink
        to="/recipes/$category/$subcategory/$recipe/view"
        params={{ category: 'soups', subcategory: 'chowders', recipe: 'clam-chowder' }}
      >
        Recipe
      </TableLink>,
    )
    const link = await screen.findByRole('link')
    expect(link).toHaveAttribute('href', '/recipes/soups/chowders/clam-chowder/view')
  })
})
