import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test-helpers/render-route'
import { server } from '../../test-helpers/msw/server'
import { RECIPES } from '../../test-helpers/msw/fixtures'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL as string

describe('Recipes without a source', () => {
  it('still renders when Supabase returns a null source', async () => {
    // The `source` column is nullable, so PostgREST sends `null` rather than omitting it
    server.use(
      http.get(`${supabaseUrl}/rest/v1/recipes`, () =>
        HttpResponse.json(
          RECIPES.filter((recipe) => recipe.subcategory_id === 10).map((recipe) => ({
            ...recipe,
            source: null,
          })),
        ),
      ),
    )

    await renderRoute('/recipes/desserts/cookies')

    expect(await screen.findByRole('link', { name: 'Chocolate Chip Cookies' })).toBeInTheDocument()
  })
})
