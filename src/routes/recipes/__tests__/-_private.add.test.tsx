import { screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { renderRoute } from '../../../test-helpers/render-route'
import { seedAuthenticatedSession } from '../../../test-helpers/auth'
import { server } from '../../../test-helpers/msw/server'
import { RECIPES } from '../../../test-helpers/msw/fixtures'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL as string

async function fillOutForm() {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText('Title'), 'Chocolate Chip Cookies')
  await user.selectOptions(screen.getByLabelText('Category'), '1')
  await user.selectOptions(screen.getByLabelText('Subcategory'), '10')
  await user.type(screen.getByLabelText('Ingredients'), 'Flour')
  await user.type(screen.getByLabelText('Directions'), 'Bake')
  await user.click(screen.getByRole('button', { name: 'Add recipe' }))
}

describe('Add recipe route', () => {
  beforeEach(() => {
    seedAuthenticatedSession()
  })

  it('redirects to the new recipe after it is added', async () => {
    const { router } = await renderRoute('/recipes/add')

    await screen.findByRole('heading', { name: 'Add recipe' })
    await fillOutForm()

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        '/recipes/desserts/cookies/chocolate-chip-cookies/view',
      )
    })
  })

  it('does not redirect when the added recipe cannot be matched to a category', async () => {
    server.use(
      http.post(`${supabaseUrl}/rest/v1/recipes`, async ({ request }) => {
        const body = (await request.json()) as (typeof RECIPES)[number] | (typeof RECIPES)[number][]
        const incoming = Array.isArray(body) ? body[0] : body
        return HttpResponse.json({
          ...incoming,
          id: 999,
          created_at: '2026-01-02T00:00:00Z',
          category_id: 999,
        })
      }),
    )

    const { router } = await renderRoute('/recipes/add')

    await screen.findByRole('heading', { name: 'Add recipe' })
    const pathBefore = router.state.location.pathname
    await fillOutForm()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add recipe' })).not.toBeDisabled()
    })
    expect(router.state.location.pathname).toBe(pathBefore)
  })

  it('does not redirect when adding the recipe fails', async () => {
    server.use(
      http.post(`${supabaseUrl}/rest/v1/recipes`, () => {
        return HttpResponse.json({ message: 'Insert failed' }, { status: 500 })
      }),
    )

    const { router } = await renderRoute('/recipes/add')

    await screen.findByRole('heading', { name: 'Add recipe' })
    const pathBefore = router.state.location.pathname

    const ignoreRejection = () => {}
    process.on('unhandledRejection', ignoreRejection)

    await fillOutForm()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add recipe' })).not.toBeDisabled()
    })
    expect(router.state.location.pathname).toBe(pathBefore)

    process.off('unhandledRejection', ignoreRejection)
  })
})
