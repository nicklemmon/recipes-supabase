import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'

export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      generatedRouteTree: './src/route-tree.gen.ts',
      // Test files live alongside routes but are not routes
      routeFileIgnorePattern: '\\.(test|spec)\\.(ts|tsx)$',
    }),
    tailwindcss(),
    react(),
    ...(mode === 'production' ? [compression({ algorithms: ['gzip', 'brotliCompress'] })] : []),
  ],
}))
