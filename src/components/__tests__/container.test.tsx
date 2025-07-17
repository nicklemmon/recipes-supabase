import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Container } from '../container'

describe('Container', () => {
  it('renders children', () => {
    render(
      <Container>
        <div>Test content</div>
      </Container>,
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default classes', () => {
    render(
      <Container>
        <div>Content</div>
      </Container>,
    )
    const container = screen.getByText('Content').parentElement
    expect(container).toHaveClass('max-w-[1000px]', 'mx-auto', 'w-full', 'px-4')
  })

  it('merges additional className prop', () => {
    render(
      <Container className="bg-red-500 py-8">
        <div>Content</div>
      </Container>,
    )
    const container = screen.getByText('Content').parentElement
    expect(container).toHaveClass(
      'max-w-[1000px]',
      'mx-auto',
      'w-full',
      'px-4',
      'bg-red-500',
      'py-8',
    )
  })

  it('handles className conflicts with tailwind-merge', () => {
    render(
      <Container className="px-8">
        <div>Content</div>
      </Container>,
    )
    const container = screen.getByText('Content').parentElement
    expect(container).toHaveClass('px-8')
    expect(container).not.toHaveClass('px-4')
  })

  it('renders without children', () => {
    const { container } = render(<Container />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('max-w-[1000px]', 'mx-auto', 'w-full', 'px-4')
  })

  it('renders with empty className', () => {
    render(
      <Container className="">
        <div>Content</div>
      </Container>,
    )
    const container = screen.getByText('Content').parentElement
    expect(container).toHaveClass('max-w-[1000px]', 'mx-auto', 'w-full', 'px-4')
  })

  it('renders with undefined className', () => {
    render(
      <Container className={undefined}>
        <div>Content</div>
      </Container>,
    )
    const container = screen.getByText('Content').parentElement
    expect(container).toHaveClass('max-w-[1000px]', 'mx-auto', 'w-full', 'px-4')
  })
})
