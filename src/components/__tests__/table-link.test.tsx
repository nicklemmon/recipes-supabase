import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { TableLink } from '../table-link'
import { renderWithRouter } from '../../test-helpers/render-with-router'

function mockTruncatedTitle() {
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(function (this: Element) {
    return this.classList.contains('truncate') ? 300 : 0
  })
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
    return this.classList.contains('truncate') ? 100 : 0
  })
}

afterEach(() => vi.restoreAllMocks())

describe('TableLink', () => {
  it('renders with children', async () => {
    renderWithRouter(<TableLink to="/recipes">Test Recipe</TableLink>)
    expect(await screen.findByRole('link')).toHaveTextContent('Test Recipe')
  })

  it('applies base styles', async () => {
    renderWithRouter(<TableLink to="/recipes">Recipe</TableLink>)
    const link = await screen.findByRole('link')
    expect(link).toHaveClass(
      'text-indigo-600',
      'dark:text-indigo-400',
      'font-medium',
      'underline',
      'decoration-indigo-400/70',
      'dark:decoration-indigo-500/70',
    )
  })

  it('truncates long titles while keeping the full title as the link name', async () => {
    renderWithRouter(<TableLink to="/recipes">A Very Long Recipe Title</TableLink>)
    const link = await screen.findByRole('link')
    const title = link.querySelector('span')
    expect(title).toHaveClass('truncate')
    expect(link).toHaveAccessibleName('A Very Long Recipe Title')
  })

  it('does not show a tooltip when the title is not truncated', async () => {
    const user = userEvent.setup()
    renderWithRouter(<TableLink to="/recipes">Recipe</TableLink>)
    await user.hover(await screen.findByRole('link'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows the full title in a tooltip on hover when truncated', async () => {
    mockTruncatedTitle()
    const user = userEvent.setup()
    renderWithRouter(<TableLink to="/recipes">A Long Recipe Title</TableLink>)
    await user.hover(await screen.findByRole('link'))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('A Long Recipe Title')
  })

  it('shows the full title in a tooltip on keyboard focus when truncated', async () => {
    mockTruncatedTitle()
    const user = userEvent.setup()
    renderWithRouter(<TableLink to="/recipes">A Long Recipe Title</TableLink>)
    await user.tab()
    expect(await screen.findByRole('tooltip')).toHaveTextContent('A Long Recipe Title')
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
