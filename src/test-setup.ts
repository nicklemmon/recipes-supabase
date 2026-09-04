import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { server } from './test-helpers/msw/server'
import { resetRecipeStore } from './test-helpers/msw/handlers'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

beforeEach(() => {
  resetRecipeStore()
  localStorage.clear()

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
