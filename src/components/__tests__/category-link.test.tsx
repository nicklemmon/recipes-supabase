import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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
      'justify-center',
      'items-center',
      'bg-gradient-to-b',
      'to-white',
      'from-white',
      'hover:from-white',
      'hover:to-indigo-50',
      'text-indigo-500',
      'shadow-lg',
      'shadow-indigo-100/50',
      'border',
      'border-indigo-200',
      'focus-visible:inset-ring-4',
      'inset-ring-indigo-700',
      'inline-flex',
      'rounded-4xl',
      'font-semibold',
      'transition',
    )
  })

  it('accepts custom className', () => {
    render(
      <CategoryLink className="custom-class" to="/recipes">
        Category
      </CategoryLink>,
    )
    const link = screen.getByText('Category')
    expect(link).toHaveClass('custom-class')
    expect(link).toHaveClass('h-42', 'w-full', 'text-indigo-500')
  })

  it('passes through additional props', () => {
    render(
      <CategoryLink data-testid="category-link" to="/recipes">
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
      <CategoryLink className="bg-red-500 custom-padding" to="/recipes">
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
