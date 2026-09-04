import { act, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { CATEGORIES } from '../../test-helpers/msw/fixtures'
import { server } from '../../test-helpers/msw/server'
import { renderRoute } from '../../test-helpers/render-route'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL as string

describe('Home pending route', () => {
  it('announces the category skeleton until the cold request completes', async () => {
    let releaseResponse!: () => void
    const responseGate = new Promise<void>((resolve) => {
      releaseResponse = resolve
    })
    server.use(
      http.get(`${supabaseUrl}/rest/v1/categories`, async () => {
        await responseGate
        return HttpResponse.json(CATEGORIES)
      }),
    )

    const { router } = await renderRoute('/', { waitForLoad: false })

    expect(await screen.findByLabelText('Loading categories')).toHaveAttribute('aria-busy', 'true')

    releaseResponse()
    await act(async () => {
      await router.load()
    })

    expect(await screen.findByRole('link', { name: /Desserts/ })).toBeInTheDocument()
  })
})
