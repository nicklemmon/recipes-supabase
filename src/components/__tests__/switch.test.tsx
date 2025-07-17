import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from '../switch'

describe('Switch', () => {
  it('renders as a switch element', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()
  })

  it('can be checked by default', () => {
    render(<Switch defaultChecked />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('accepts custom className', () => {
    render(<Switch className="custom-class" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-class')
    expect(switchElement).toHaveClass('relative', 'cursor-pointer', 'bg-slate-400')
  })

  it('toggles when clicked', async () => {
    const user = userEvent.setup()
    render(<Switch />)
    const switchElement = screen.getByRole('switch')

    expect(switchElement).not.toBeChecked()

    await user.click(switchElement)
    expect(switchElement).toBeChecked()

    await user.click(switchElement)
    expect(switchElement).not.toBeChecked()
  })

  it('calls onChange when toggled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Switch onCheckedChange={onChange} />)
    const switchElement = screen.getByRole('switch')

    await user.click(switchElement)
    expect(onChange).toHaveBeenCalledWith(true, expect.any(Object))

    await user.click(switchElement)
    expect(onChange).toHaveBeenCalledWith(false, expect.any(Object))
  })

  it('can be controlled', () => {
    const { rerender } = render(<Switch checked={false} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()

    rerender(<Switch checked={true} />)
    expect(switchElement).toBeChecked()
  })

  it('can be disabled', () => {
    render(<Switch disabled />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
  })

  it('cannot be toggled when disabled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Switch disabled onCheckedChange={onChange} />)
    const switchElement = screen.getByRole('switch')

    await user.click(switchElement)
    expect(onChange).not.toHaveBeenCalled()
    expect(switchElement).not.toBeChecked()
  })

  it('accepts additional props', () => {
    render(<Switch data-testid="custom-switch" id="switch-id" />)
    const switchElement = screen.getByTestId('custom-switch')
    expect(switchElement).toHaveAttribute('id', 'switch-id')
  })

  it('renders thumb element', () => {
    render(<Switch />)
    const thumbElement = screen.getByRole('switch').querySelector('[class*="aspect-square"]')
    expect(thumbElement).toBeInTheDocument()
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Switch />)
    const switchElement = screen.getByRole('switch')

    switchElement.focus()
    expect(switchElement).toHaveFocus()

    await user.keyboard(' ')
    expect(switchElement).toBeChecked()

    await user.keyboard(' ')
    expect(switchElement).not.toBeChecked()
  })
})
