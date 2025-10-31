import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tag } from '../tag'

describe('Tag', () => {
  it('renders with text', () => {
    render(<Tag colorScheme="slate">Test Tag</Tag>)
    expect(screen.getByText('Test Tag')).toBeInTheDocument()
  })

  it('applies base styles', () => {
    render(<Tag colorScheme="slate">Tag</Tag>)
    const tag = screen.getByText('Tag')
    expect(tag).toHaveClass('rounded-xl', 'h-12', 'px-4', 'bg-slate-400', 'text-slate-800')
  })

  it('applies red color scheme', () => {
    render(<Tag colorScheme="red">Red Tag</Tag>)
    const tag = screen.getByText('Red Tag')
    expect(tag).toBeInTheDocument()
  })

  it('applies yellow color scheme', () => {
    render(<Tag colorScheme="yellow">Yellow Tag</Tag>)
    const tag = screen.getByText('Yellow Tag')
    expect(tag).toBeInTheDocument()
  })

  it('applies indigo color scheme', () => {
    render(<Tag colorScheme="indigo">Indigo Tag</Tag>)
    const tag = screen.getByText('Indigo Tag')
    expect(tag).toBeInTheDocument()
  })

  it('applies cyan color scheme', () => {
    render(<Tag colorScheme="cyan">Cyan Tag</Tag>)
    const tag = screen.getByText('Cyan Tag')
    expect(tag).toBeInTheDocument()
  })

  it('applies slate color scheme', () => {
    render(<Tag colorScheme="slate">Slate Tag</Tag>)
    const tag = screen.getByText('Slate Tag')
    expect(tag).toBeInTheDocument()
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
      <Tag className="custom-class" colorScheme="slate">
        Tag
      </Tag>,
    )
    const tag = screen.getByText('Tag')
    expect(tag).toHaveClass('custom-class')
    expect(tag).toHaveClass('rounded-xl', 'h-12', 'px-4', 'bg-slate-400', 'text-slate-800')
  })
})
