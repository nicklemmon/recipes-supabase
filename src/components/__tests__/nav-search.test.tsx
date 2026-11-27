import { Tooltip } from '@base-ui/react/tooltip'
import { fireEvent, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../test-helpers/render-with-router'
import { NavSearch } from '../nav-search'

it('focuses the search field as soon as the drawer opens', async () => {
  renderWithRouter(
    <Tooltip.Provider>
      <NavSearch />
    </Tooltip.Provider>,
  )

  fireEvent.click(await screen.findByRole('button', { name: 'Search' }))

  expect(screen.getByRole('textbox', { name: 'Search by title' })).toHaveFocus()
})
