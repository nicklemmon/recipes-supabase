import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { NavThemeMenu } from '../nav-theme-menu'
import { ThemeProvider } from '../../hooks/use-theme'
import { THEME_STORAGE_KEY } from '../../helpers/theme'

function renderMenu() {
  return render(
    <ThemeProvider>
      <NavThemeMenu />
    </ThemeProvider>,
  )
}

describe('NavThemeMenu', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders a theme button', () => {
    renderMenu()
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument()
  })

  it('shows the three theme choices when opened', async () => {
    const user = userEvent.setup()
    renderMenu()

    await user.click(screen.getByRole('button', { name: 'Theme' }))

    expect(screen.getByRole('menuitemradio', { name: 'System' })).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: 'Light' })).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toBeInTheDocument()
  })

  it('selects a theme from the menu', async () => {
    const user = userEvent.setup()
    renderMenu()

    await user.click(screen.getByRole('button', { name: 'Theme' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }))

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })
})
