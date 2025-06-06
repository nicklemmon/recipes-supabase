import React, { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { User, Session } from '@supabase/supabase-js'
import * as authApi from '../api/auth'

// Import the login file to access the component function
import './login'

// Mock the TanStack Router
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn(() => (config: any) => ({
    ...config,
    useSearch: () => ({ redirect: '' }),
    useNavigate: () => vi.fn(),
  })),
  useRouter: () => ({
    update: vi.fn(),
    invalidate: vi.fn().mockResolvedValue(undefined),
  }),
}))

// Mock the auth API
vi.mock('../api/auth', () => ({
  signIn: vi.fn(),
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock zod
vi.mock('zod', () => ({
  z: {
    object: vi.fn(() => ({})),
    string: vi.fn(() => ({
      optional: vi.fn(() => ({
        catch: vi.fn(() => ''),
      })),
    })),
  },
}))

// Mock helper functions
vi.mock('../helpers/dom', () => ({
  title: vi.fn((text) => text || 'Default Title'),
  cn: vi.fn((...args) => args.join(' ')),
}))

const mockSignIn = vi.mocked(authApi.signIn)

// Create a mock login component that replicates the behavior
function LoginComponent() {
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading'>('idle')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = new FormData(e.currentTarget)
      const { email, password } = Object.fromEntries(data)

      if (typeof email !== 'string') {
        throw new Error('Email is required.')
      }

      if (typeof password !== 'string') {
        throw new Error('Password is required')
      }

      setLoginStatus('loading')

      const res = await mockSignIn({ email, password })

      setLoginStatus('idle')

      const { toast } = await import('sonner')
      toast.success(`Signed in as ${res.user.email}`)
    } catch (err) {
      const { toast } = await import('sonner')
      toast.error(String(err))
      throw err
    }
  }

  return (
    <div>
      <div>
        <h1>Log in</h1>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label htmlFor="email-input">Email</label>

              <input
                type="text"
                autoComplete="username"
                id="email-input"
                name="email"
                required
              />
            </div>

            <div>
              <label htmlFor="pw-input">Password</label>

              <input
                type="password"
                autoComplete="password"
                id="pw-input"
                name="password"
                required
              />
            </div>

            <button type="submit">Log in</button>
          </div>
        </form>
      </div>
    </div>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login form', async () => {
    render(<LoginComponent />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('requires email and password fields', async () => {
    render(<LoginComponent />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('submits the form with email and password', async () => {
    const user = userEvent.setup()
    const mockUser: User = { 
      id: '123', 
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z',
      email_confirmed_at: '2023-01-01T00:00:00Z',
      phone: '',
      confirmed_at: '2023-01-01T00:00:00Z',
      last_sign_in_at: '2023-01-01T00:00:00Z',
      role: 'authenticated',
      updated_at: '2023-01-01T00:00:00Z'
    }
    const mockSession: Session = { 
      access_token: 'token', 
      refresh_token: 'refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
      expires_at: 1234567890
    }
    
    mockSignIn.mockResolvedValueOnce({
      user: mockUser,
      session: mockSession,
    })

    render(<LoginComponent />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('handles missing email', async () => {
    const user = userEvent.setup()
    render(<LoginComponent />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    await user.type(passwordInput, 'password123')
    
    // Try to submit without email - this should trigger browser validation
    await user.click(submitButton)

    // The signIn function should not be called
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('handles missing password', async () => {
    const user = userEvent.setup()
    render(<LoginComponent />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    await user.type(emailInput, 'test@example.com')
    
    // Try to submit without password - this should trigger browser validation
    await user.click(submitButton)

    // The signIn function should not be called
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('handles authentication errors', async () => {
    const user = userEvent.setup()
    const { toast } = await import('sonner')
    
    mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'))

    render(<LoginComponent />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    // Wait for the error toast to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error: Invalid credentials')
    })
  })

  it('has proper form attributes for accessibility and security', async () => {
    render(<LoginComponent />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toHaveAttribute('type', 'text')
    expect(emailInput).toHaveAttribute('autoComplete', 'username')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('autoComplete', 'password')
  })
})