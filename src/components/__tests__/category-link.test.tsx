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
    render(<CategoryLink to="/test">Test Category</CategoryLink>)
    expect(screen.getByText('Test Category')).toBeInTheDocument()
  })

  it('applies base styles', () => {
    render(<CategoryLink to="/test">Category</CategoryLink>)
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
      <CategoryLink to="/test" className="custom-class">
        Category
      </CategoryLink>,
    )
    const link = screen.getByText('Category')
    expect(link).toHaveClass('custom-class')
    expect(link).toHaveClass('h-42', 'w-full', 'text-indigo-500')
  })

  it('passes through additional props', () => {
    render(
      <CategoryLink to="/test" data-testid="category-link" id="link-id">
        Category
      </CategoryLink>,
    )
    const link = screen.getByTestId('category-link')
    expect(link).toHaveAttribute('id', 'link-id')
    expect(link).toHaveAttribute('to', '/test')
  })

  it('renders as anchor element when mocked', () => {
    render(<CategoryLink to="/test">Category</CategoryLink>)
    const link = screen.getByText('Category')
    expect(link.tagName).toBe('A')
  })

  it('merges className with base styles correctly', () => {
    render(
      <CategoryLink to="/test" className="bg-red-500 custom-padding">
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
