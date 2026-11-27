import { Tooltip } from '@base-ui/react/tooltip'
import { fireEvent, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { renderWithRouter } from '../../test-helpers/render-with-router'
import { NavSearch } from '../nav-search'

function renderSearch() {
  return renderWithRouter(
    <Tooltip.Provider>
      <NavSearch />
    </Tooltip.Provider>,
  )
}

it('focuses the search field as soon as the drawer opens', async () => {
  renderSearch()

  fireEvent.click(await screen.findByRole('button', { name: 'Search' }))

  expect(screen.getByRole('textbox', { name: 'Search by title' })).toHaveFocus()
})

it('stops updating the drawer position after it closes', async () => {
  const viewport = Object.assign(new EventTarget(), { height: 400, offsetTop: 0 })
  vi.stubGlobal('visualViewport', viewport)

  try {
    renderSearch()
    fireEvent.click(await screen.findByRole('button', { name: 'Search' }))
    const drawer = screen.getByRole('dialog', { name: 'Search for recipes' })

    viewport.offsetTop = 50
    viewport.dispatchEvent(new Event('scroll'))
    expect(drawer.style.getPropertyValue('--search-viewport-bottom')).toBe('450px')

    // The test DOM does not run the drawer's exit animation.
    drawer.style.animationName = 'none'
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(drawer).not.toBeInTheDocument()

    viewport.offsetTop = 0
    viewport.dispatchEvent(new Event('scroll'))
    expect(drawer.style.getPropertyValue('--search-viewport-bottom')).toBe('450px')

    viewport.height = 300
    viewport.dispatchEvent(new Event('resize'))
    expect(drawer.style.getPropertyValue('--search-viewport-bottom')).toBe('450px')
  } finally {
    vi.unstubAllGlobals()
  }
})
