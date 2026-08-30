import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/test-setup.ts'],
      env: {
        VITE_SUPABASE_PROJECT_URL: env.VITE_SUPABASE_PROJECT_URL,
        VITE_SUPABASE_CLIENT_KEY: env.VITE_SUPABASE_CLIENT_KEY,
      },
    },
  }
})
