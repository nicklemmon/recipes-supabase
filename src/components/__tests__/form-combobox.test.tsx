import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FormCombobox } from '../form-combobox'

const OPTIONS = [
  { label: 'Gluten Free', value: 'gluten-free' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Dairy Free', value: 'dairy-free' },
]

describe('FormCombobox', () => {
  it('renders the input', () => {
    render(<FormCombobox options={OPTIONS} value={[]} onValueChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows placeholder when no items are selected', () => {
    render(
      <FormCombobox
        options={OPTIONS}
        value={[]}
        onValueChange={vi.fn()}
        placeholder="Select preferences..."
      />,
    )
    expect(screen.getByPlaceholderText('Select preferences...')).toBeInTheDocument()
  })

  it('renders chips for pre-selected values', () => {
    render(
      <FormCombobox options={OPTIONS} value={['gluten-free', 'vegan']} onValueChange={vi.fn()} />,
    )
    expect(screen.getByText('Gluten Free')).toBeInTheDocument()
    expect(screen.getByText('Vegan')).toBeInTheDocument()
  })

  it('calls onValueChange with remaining slugs when a chip is removed', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <FormCombobox
        options={OPTIONS}
        value={['gluten-free', 'vegan']}
        onValueChange={onValueChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Remove Gluten Free' }))

    expect(onValueChange).toHaveBeenCalledWith(['vegan'])
  })

  it('calls onValueChange with empty array when last chip is removed', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(<FormCombobox options={OPTIONS} value={['vegan']} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Remove Vegan' }))

    expect(onValueChange).toHaveBeenCalledWith([])
  })
})
