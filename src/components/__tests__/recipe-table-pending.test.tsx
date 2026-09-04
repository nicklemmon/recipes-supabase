import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RecipeTablePending } from '../recipe-table-pending'

describe('RecipeTablePending', () => {
  it('announces that recipes are loading while preserving the table structure', () => {
    render(<RecipeTablePending />)

    expect(screen.getByLabelText('Loading recipes')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('table', { name: 'Recipes' })).toBeInTheDocument()
  })
})
