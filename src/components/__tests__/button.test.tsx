import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-indigo-600', 'text-indigo-50')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-indigo-100', 'text-indigo-600')
  })

  it('applies destructive variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-100', 'text-red-600')
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('cursor-wait', 'opacity-75')
  })

  it('ignores clicks while loading so a form cannot be submitted twice', () => {
    const onClick = vi.fn()
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading onClick={onClick}>
          Save
        </Button>
      </form>,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('stays focusable while loading so keyboard focus is not lost', () => {
    render(<Button loading>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })

    button.focus()

    // A natively disabled button drops focus to the page body in browsers
    expect(button).toHaveFocus()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('shows disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
    expect(button).toBeDisabled()
  })
})
