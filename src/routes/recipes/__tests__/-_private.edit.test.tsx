import { screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { seedAuthenticatedSession } from '../../../test-helpers/auth'
import { renderRoute } from '../../../test-helpers/render-route'

describe('Edit recipe route', () => {
  beforeEach(() => {
    seedAuthenticatedSession()
  })

  it('shows the recipe at its new category and subcategory after moving it', async () => {
    const user = userEvent.setup()
    const { router } = await renderRoute('/recipes/desserts/cookies/chocolate-chip-cookies/edit')

    await screen.findByRole('heading', { name: 'Editing Chocolate Chip Cookies' })

    await user.selectOptions(screen.getByLabelText('Category'), '2')
    await user.selectOptions(screen.getByLabelText('Subcategory'), '20')
    await user.click(screen.getByRole('button', { name: 'Save recipe' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        '/recipes/dinner/pasta/chocolate-chip-cookies/view',
      )
    })

    expect(
      await screen.findByRole('heading', { name: 'Chocolate Chip Cookies' }),
    ).toBeInTheDocument()
  })
})
