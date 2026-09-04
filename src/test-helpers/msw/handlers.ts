import { http, HttpResponse } from 'msw'
import { CATEGORIES, DIETARY_PREFERENCES, RECIPES, SUBCATEGORIES } from './fixtures'
import type { Recipe } from '../../types/recipes'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL as string

/** Mutable recipe list so delete/add tests can change network responses. */
let recipes = structuredClone(RECIPES)

export function resetRecipeStore() {
  recipes = structuredClone(RECIPES)
}

export function getRecipeStore() {
  return recipes
}

function eqParam(value: string | null) {
  if (!value) return null
  return value.startsWith('eq.') ? value.slice(3) : value
}

function ilikeContains(value: string | null) {
  if (!value) return null
  // PostgREST via supabase-js: title=ilike.%25chip%25 → "ilike.%chip%"
  if (value.startsWith('ilike.')) {
    return value.slice('ilike.'.length).replaceAll('%', '')
  }
  return value
}

function wantsSingle(request: Request) {
  const accept = request.headers.get('Accept') ?? ''
  return accept.includes('application/vnd.pgrst.object+json')
}

function respondRows<T extends object>(request: Request, rows: T[]) {
  if (wantsSingle(request)) {
    if (rows.length === 0) {
      return HttpResponse.json(
        { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' },
        { status: 406 },
      )
    }
    return HttpResponse.json(rows[0] as object)
  }
  return HttpResponse.json(rows as object[])
}

export const handlers = [
  http.get(`${supabaseUrl}/rest/v1/categories`, ({ request }) => {
    const url = new URL(request.url)
    const slug = eqParam(url.searchParams.get('slug'))
    const rows = slug ? CATEGORIES.filter((c) => c.slug === slug) : CATEGORIES
    return respondRows(request, rows)
  }),

  http.get(`${supabaseUrl}/rest/v1/subcategories`, ({ request }) => {
    const url = new URL(request.url)
    const slug = eqParam(url.searchParams.get('slug'))
    const categoryId = eqParam(url.searchParams.get('category_id'))
    let rows = SUBCATEGORIES
    if (slug) rows = rows.filter((s) => s.slug === slug)
    if (categoryId) rows = rows.filter((s) => s.category_id === Number(categoryId))
    return respondRows(request, rows)
  }),

  http.get(`${supabaseUrl}/rest/v1/dietary_preferences`, ({ request }) => {
    return respondRows(request, DIETARY_PREFERENCES)
  }),

  http.get(`${supabaseUrl}/rest/v1/recipes`, ({ request }) => {
    const url = new URL(request.url)
    const slug = eqParam(url.searchParams.get('slug'))
    const categoryId = eqParam(url.searchParams.get('category_id'))
    const subcategoryId = eqParam(url.searchParams.get('subcategory_id'))
    const rating = eqParam(url.searchParams.get('rating'))
    const titleSearch = ilikeContains(url.searchParams.get('title'))

    let rows: Recipe[] = recipes
    if (slug) rows = rows.filter((r) => r.slug === slug)
    if (categoryId) rows = rows.filter((r) => r.category_id === Number(categoryId))
    if (subcategoryId) rows = rows.filter((r) => r.subcategory_id === Number(subcategoryId))
    if (rating) rows = rows.filter((r) => r.rating === Number(rating))
    if (titleSearch) {
      const needle = titleSearch.toLowerCase()
      rows = rows.filter((r) => r.title.toLowerCase().includes(needle))
    }
    return respondRows(request, rows)
  }),

  http.delete(`${supabaseUrl}/rest/v1/recipes`, ({ request }) => {
    const url = new URL(request.url)
    const id = eqParam(url.searchParams.get('id'))
    if (id) {
      recipes = recipes.filter((r) => r.id !== Number(id))
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${supabaseUrl}/rest/v1/recipes`, async ({ request }) => {
    const body = (await request.json()) as Recipe | Recipe[]
    const incoming = Array.isArray(body) ? body[0] : body
    const created: Recipe = {
      ...incoming,
      id: incoming.id ?? Math.max(0, ...recipes.map((r) => r.id)) + 1,
      created_at: incoming.created_at ?? '2026-01-02T00:00:00Z',
    }
    recipes = [...recipes, created]
    return respondRows(request, [created])
  }),

  http.patch(`${supabaseUrl}/rest/v1/recipes`, async ({ request }) => {
    const url = new URL(request.url)
    const id = eqParam(url.searchParams.get('id'))
    const body = (await request.json()) as Partial<Recipe>
    recipes = recipes.map((r) => (String(r.id) === id ? { ...r, ...body } : r))
    const updated = recipes.filter((r) => String(r.id) === id)
    return respondRows(request, updated)
  }),

  // Auth endpoints — default unauthenticated session for public browse tests
  http.get(`${supabaseUrl}/auth/v1/user`, () => {
    return HttpResponse.json({ message: 'not authenticated' }, { status: 401 })
  }),
]
