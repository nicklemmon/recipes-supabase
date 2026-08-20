import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeToggle } from '../theme-toggle'
import { ThemeProvider } from '../../hooks/use-theme'
import { THEME_STORAGE_KEY } from '../../helpers/theme'

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders the three theme options', () => {
    renderToggle()

    expect(screen.getByRole('button', { name: 'System' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Light' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dark' })).toBeInTheDocument()
  })

  it('marks System as pressed by default', () => {
    renderToggle()

    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('selects Dark and persists the preference', async () => {
    const user = userEvent.setup()
    renderToggle()

    await user.click(screen.getByRole('button', { name: 'Dark' }))

    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('selects Light and removes the dark class', async () => {
    const user = userEvent.setup()
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    document.documentElement.classList.add('dark')

    renderToggle()

    await user.click(screen.getByRole('button', { name: 'Light' }))

    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('is keyboard focusable', async () => {
    const user = userEvent.setup()
    renderToggle()

    await user.tab()

    expect(screen.getByRole('button', { name: 'System' })).toHaveFocus()
  })
})
