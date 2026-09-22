import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test-helpers/render-route'
import { server } from '../../test-helpers/msw/server'
import { RECIPES } from '../../test-helpers/msw/fixtures'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL as string

describe('Favorites', () => {
  it('says there are no favorites instead of showing an empty table', async () => {
    server.use(http.get(`${supabaseUrl}/rest/v1/recipes`, () => HttpResponse.json([])))

    await renderRoute('/recipes/favorites')

    expect(await screen.findByText('No favorite recipes yet.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('leaves out favorites it cannot link to', async () => {
    server.use(
      http.get(`${supabaseUrl}/rest/v1/recipes`, () =>
        // A recipe whose category no longer exists has no URL
        HttpResponse.json([{ ...RECIPES[0], category_id: 999 }]),
      ),
    )

    await renderRoute('/recipes/favorites')

    expect(await screen.findByText('No favorite recipes yet.')).toBeInTheDocument()
  })
})
