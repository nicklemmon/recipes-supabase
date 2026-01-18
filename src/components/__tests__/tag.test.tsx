import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Tag } from '../tag'

describe('Tag', () => {
  it('renders with text', () => {
    render(<Tag colorScheme="slate">Test Tag</Tag>)
    expect(screen.getByText('Test Tag')).toBeInTheDocument()
  })

  it('applies base styles', () => {
    render(<Tag colorScheme="slate">Tag</Tag>)
    const tag = screen.getByText('Tag')
    expect(tag).toHaveClass('rounded-xl', 'h-7', 'px-3', 'py-1', 'text-sm', 'font-medium')
  })

  it('applies red color scheme', () => {
    render(<Tag colorScheme="red">Red Tag</Tag>)
    const tag = screen.getByText('Red Tag')
    expect(tag).toHaveClass('bg-red-100', 'text-red-700')
  })

  it('applies yellow color scheme', () => {
    render(<Tag colorScheme="yellow">Yellow Tag</Tag>)
    const tag = screen.getByText('Yellow Tag')
    expect(tag).toHaveClass('bg-yellow-100', 'text-yellow-700')
  })

  it('applies indigo color scheme', () => {
    render(<Tag colorScheme="indigo">Indigo Tag</Tag>)
    const tag = screen.getByText('Indigo Tag')
    expect(tag).toHaveClass('bg-indigo-100', 'text-indigo-700')
  })

  it('applies cyan color scheme', () => {
    render(<Tag colorScheme="cyan">Cyan Tag</Tag>)
    const tag = screen.getByText('Cyan Tag')
    expect(tag).toHaveClass('bg-cyan-100', 'text-cyan-700')
  })

  it('applies slate color scheme', () => {
    render(<Tag colorScheme="slate">Slate Tag</Tag>)
    const tag = screen.getByText('Slate Tag')
    expect(tag).toHaveClass('bg-slate-200', 'text-slate-700')
  })

  it('applies default slate color scheme when not specified', () => {
    render(<Tag>Default Tag</Tag>)
    const tag = screen.getByText('Default Tag')
    expect(tag).toHaveClass('bg-slate-200', 'text-slate-700')
  })

  it('accepts additional props', () => {
    render(
      <Tag colorScheme="slate" data-testid="custom-tag" id="tag-id">
        Tag
      </Tag>,
    )
    const tag = screen.getByTestId('custom-tag')
    expect(tag).toHaveAttribute('id', 'tag-id')
  })

  it('renders as span element', () => {
    render(<Tag colorScheme="slate">Tag</Tag>)
    const tag = screen.getByText('Tag')
    expect(tag.tagName).toBe('SPAN')
  })

  it('accepts custom className', () => {
    render(
      <Tag colorScheme="slate" className="custom-class">
        Tag
      </Tag>,
    )
    const tag = screen.getByText('Tag')
    expect(tag).toHaveClass('custom-class')
    expect(tag).toHaveClass('rounded-xl', 'h-7', 'px-3', 'py-1', 'text-sm', 'font-medium')
  })
})
