import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test-helpers/render-route'
import { server } from '../../test-helpers/msw/server'
import { RECIPES } from '../../test-helpers/msw/fixtures'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL as string

describe('Recipe search results', () => {
  it('uses the singular when one recipe matches', async () => {
    await renderRoute('/recipes/list?s=chip')

    expect(await screen.findByText(/1 recipe found\./)).toBeInTheDocument()
  })

  it('only counts recipes it can link to', async () => {
    server.use(
      http.get(`${supabaseUrl}/rest/v1/recipes`, () =>
        HttpResponse.json([
          RECIPES[0],
          // A recipe whose category no longer exists cannot be linked to, so it is not shown
          { ...RECIPES[1], category_id: 999 },
        ]),
      ),
    )

    await renderRoute('/recipes/list?s=cookies')

    expect(await screen.findByRole('link', { name: 'Chocolate Chip Cookies' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Sugar Cookies' })).not.toBeInTheDocument()
    expect(screen.getByText(/1 recipe found\./)).toBeInTheDocument()
  })
})
