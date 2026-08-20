import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ThemeToggle } from '../theme-toggle'
import { ThemeProvider } from '../../hooks/use-theme'
import { THEME_STORAGE_KEY, unwatchSystemTheme } from '../../helpers/theme'

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

function getOption(name: string) {
  return screen.getByRole('radio', { name })
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    unwatchSystemTheme()
  })

  it('renders the three theme options', () => {
    renderToggle()

    expect(getOption('System')).toBeInTheDocument()
    expect(getOption('Light')).toBeInTheDocument()
    expect(getOption('Dark')).toBeInTheDocument()
  })

  it('marks System as selected by default', () => {
    renderToggle()

    expect(getOption('System')).toBeChecked()
    expect(getOption('Light')).not.toBeChecked()
    expect(getOption('Dark')).not.toBeChecked()
  })

  it('selects Dark and persists the preference', async () => {
    const user = userEvent.setup()
    renderToggle()

    await user.click(getOption('Dark'))

    expect(getOption('Dark')).toBeChecked()
    expect(getOption('System')).not.toBeChecked()
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('selects Light and removes the dark class', async () => {
    const user = userEvent.setup()
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    document.documentElement.classList.add('dark')

    renderToggle()

    await user.click(getOption('Light'))

    expect(getOption('Light')).toBeChecked()
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('keeps the selected option when it is clicked again', async () => {
    const user = userEvent.setup()
    renderToggle()

    await user.click(getOption('System'))

    expect(getOption('System')).toBeChecked()
    expect(getOption('Light')).not.toBeChecked()
    expect(getOption('Dark')).not.toBeChecked()
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  })

  it('is keyboard focusable', async () => {
    const user = userEvent.setup()
    renderToggle()

    await user.tab()

    expect(getOption('System')).toHaveFocus()
  })
})
