import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useScrollAndFocusOnNavigate } from '../use-scroll-and-focus-on-navigate'

const mockUnsubscribe = vi.fn()
const mockSubscribe = vi.fn(() => mockUnsubscribe)
const mockRouter = { subscribe: mockSubscribe }

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => mockRouter,
}))

describe('useScrollAndFocusOnNavigate', () => {
  let mainEl: HTMLElement

  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    mainEl = document.createElement('main')
    vi.spyOn(mainEl, 'focus')
    document.body.appendChild(mainEl)
    mockSubscribe.mockClear()
    mockUnsubscribe.mockClear()
  })

  afterEach(() => {
    document.body.removeChild(mainEl)
    vi.restoreAllMocks()
  })

  it('subscribes to onResolved on mount', () => {
    renderHook(() => useScrollAndFocusOnNavigate())
    expect(mockSubscribe).toHaveBeenCalledWith('onResolved', expect.any(Function))
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useScrollAndFocusOnNavigate())
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('scrolls to top and focuses main when path changes', () => {
    renderHook(() => useScrollAndFocusOnNavigate())
    const handler = mockSubscribe.mock.calls[0][1]

    handler({ pathChanged: true })

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    expect(mainEl.focus).toHaveBeenCalled()
  })

  it('does nothing when only query params change', () => {
    renderHook(() => useScrollAndFocusOnNavigate())
    const handler = mockSubscribe.mock.calls[0][1]

    handler({ pathChanged: false })

    expect(window.scrollTo).not.toHaveBeenCalled()
    expect(mainEl.focus).not.toHaveBeenCalled()
  })
})
