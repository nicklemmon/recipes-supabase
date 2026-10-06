import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RecipeTablePending } from '../recipe-table-pending'

describe('RecipeTablePending', () => {
  it('announces that recipes are loading while preserving the table structure', () => {
    render(<RecipeTablePending />)

    expect(screen.getByLabelText('Loading recipes')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('table', { name: 'Recipes' })).toBeInTheDocument()
  })

  it.each([true, false])(
    'gives the header and each row the same number of columns (showDietaryPref=%s)',
    (showDietaryPref) => {
      render(<RecipeTablePending showDietaryPref={showDietaryPref} />)

      const [headerRow, ...bodyRows] = screen.getAllByRole('row')
      const headerCells = within(headerRow).getAllByRole('columnheader')

      expect(bodyRows.length).toBeGreaterThan(0)
      for (const row of bodyRows) {
        expect(within(row).getAllByRole('cell')).toHaveLength(headerCells.length)
      }
    },
  )

  it('leaves out the dietary preference column when asked', () => {
    render(<RecipeTablePending showDietaryPref={false} />)

    expect(screen.queryByRole('columnheader', { name: 'Dietary pref.' })).not.toBeInTheDocument()
  })
})
