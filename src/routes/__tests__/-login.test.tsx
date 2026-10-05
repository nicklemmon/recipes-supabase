import { screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { renderRoute } from '../../test-helpers/render-route'
import { server } from '../../test-helpers/msw/server'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL as string

describe('Log in route', () => {
  it('shows the error and lets the person try again when sign-in fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.post(`${supabaseUrl}/auth/v1/token`, () =>
        HttpResponse.json(
          { code: 'invalid_credentials', message: 'Invalid login credentials' },
          { status: 400 },
        ),
      ),
    )

    await renderRoute('/login')
    const user = userEvent.setup()

    await user.type(await screen.findByLabelText('Email'), 'cook@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText(/Invalid login credentials/)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled())
  })

  it('shows it is busy and ignores repeat clicks while signing in', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    let tokenRequests = 0
    let finishRequest!: () => void
    const requestHeld = new Promise<void>((resolve) => {
      finishRequest = resolve
    })
    server.use(
      http.post(`${supabaseUrl}/auth/v1/token`, async () => {
        tokenRequests += 1
        await requestHeld
        return HttpResponse.json(
          { code: 'invalid_credentials', message: 'Invalid login credentials' },
          { status: 400 },
        )
      }),
    )

    await renderRoute('/login')
    const user = userEvent.setup()

    await user.type(await screen.findByLabelText('Email'), 'cook@example.com')
    await user.type(screen.getByLabelText('Password'), 'a-password')
    const button = screen.getByRole('button', { name: 'Log in' })
    await user.click(button)

    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'true'))
    await user.click(button)
    expect(tokenRequests).toBe(1)

    finishRequest()
    await waitFor(() => expect(button).not.toHaveAttribute('aria-busy'))
  })
})
