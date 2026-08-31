import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

/** Dummy project URL for CI/MSW when `.env` is absent. Must be a valid http(s) URL. */
const TEST_SUPABASE_URL = 'https://test.supabase.co'
const TEST_SUPABASE_KEY = 'test-anon-key'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/test-setup.ts'],
      env: {
        VITE_SUPABASE_PROJECT_URL: env.VITE_SUPABASE_PROJECT_URL || TEST_SUPABASE_URL,
        VITE_SUPABASE_CLIENT_KEY: env.VITE_SUPABASE_CLIENT_KEY || TEST_SUPABASE_KEY,
      },
    },
  }
})
