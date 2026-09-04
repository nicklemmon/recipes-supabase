const SUPABASE_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL as string
const PROJECT_REF = new URL(SUPABASE_URL).hostname.split('.')[0]
export const SUPABASE_AUTH_STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`

/** Seeds a signed-in Supabase session into localStorage for private-route tests. */
export function seedAuthenticatedSession(email = 'tester@example.com') {
  const now = Math.floor(Date.now() / 1000)
  const session = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    expires_at: now + 3600,
    token_type: 'bearer',
    user: {
      id: '00000000-0000-4000-8000-000000000001',
      aud: 'authenticated',
      role: 'authenticated',
      email,
      app_metadata: {},
      user_metadata: {},
      created_at: '2026-01-01T00:00:00.000Z',
    },
  }

  localStorage.setItem(SUPABASE_AUTH_STORAGE_KEY, JSON.stringify(session))
}
