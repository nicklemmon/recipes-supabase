import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmptyCell } from '../empty-cell'

describe('EmptyCell', () => {
  it('renders a dash', () => {
    render(<EmptyCell />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders default sr-only label', () => {
    render(<EmptyCell />)
    expect(screen.getByText('None')).toBeInTheDocument()
  })

  it('accepts a custom label', () => {
    render(<EmptyCell label="No rating" />)
    expect(screen.getByText('No rating')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    render(<EmptyCell className="custom-class" data-testid="empty-cell" />)
    expect(screen.getByTestId('empty-cell')).toHaveClass('custom-class')
  })
})
