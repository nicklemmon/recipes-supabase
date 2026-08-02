import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CategoryLink } from '../category-link'

// Mock TanStack Router's Link component
vi.mock('@tanstack/react-router', () => ({
  Link: vi.fn(({ children, className, ...props }) => (
    <a className={className} {...props}>
      {children}
    </a>
  )),
}))

describe('CategoryLink', () => {
  it('renders with children', () => {
    render(<CategoryLink to="/recipes">Test Category</CategoryLink>)
    expect(screen.getByText('Test Category')).toBeInTheDocument()
  })

  it('applies base styles', () => {
    render(<CategoryLink to="/recipes">Category</CategoryLink>)
    const link = screen.getByText('Category')
    expect(link).toHaveClass(
      'h-42',
      'w-full',
      'inline-flex',
      'justify-center',
      'items-center',
      'rounded-4xl',
      'font-semibold',
      'bg-gradient-to-b',
      'border',
      'shadow-lg',
      'transition',
    )
  })

  // Asserted by variant prefix rather than exact color so restyling does not
  // break the test. The intent is that each state has *some* styling.
  it('styles hover, focus, and active states', () => {
    render(<CategoryLink to="/recipes">Category</CategoryLink>)
    const link = screen.getByText('Category')
    expect(link.className).toMatch(/(?<!:)hover:/)
    expect(link.className).toMatch(/focus-visible:/)
    expect(link.className).toMatch(/(?<!:)active:/)
  })

  it('respects reduced motion for the hover lift', () => {
    render(<CategoryLink to="/recipes">Category</CategoryLink>)
    const link = screen.getByText('Category')
    expect(link).toHaveClass('motion-safe:hover:-translate-y-0.5')
  })

  it('accepts custom className', () => {
    render(
      <CategoryLink to="/recipes" className="custom-class">
        Category
      </CategoryLink>,
    )
    const link = screen.getByText('Category')
    expect(link).toHaveClass('custom-class')
    expect(link).toHaveClass('h-42', 'w-full', 'text-indigo-500')
  })

  it('passes through additional props', () => {
    render(
      <CategoryLink to="/recipes" data-testid="category-link">
        Category
      </CategoryLink>,
    )
    const link = screen.getByTestId('category-link')
    expect(link).toHaveAttribute('data-testid', 'category-link')
    expect(link).toHaveAttribute('to', '/recipes')
  })

  it('renders as anchor element when mocked', () => {
    render(<CategoryLink to="/recipes">Category</CategoryLink>)
    const link = screen.getByText('Category')
    expect(link.tagName).toBe('A')
  })

  it('merges className with base styles correctly', () => {
    render(
      <CategoryLink to="/recipes" className="bg-red-500 custom-padding">
        Category
      </CategoryLink>,
    )
    const link = screen.getByText('Category')
    // Should have custom classes
    expect(link).toHaveClass('bg-red-500', 'custom-padding')
    // Should still have other base classes that don't conflict
    expect(link).toHaveClass('h-42', 'w-full', 'text-indigo-500')
  })
})
