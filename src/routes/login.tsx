import { createFileRoute, useRouter, redirect, useRouteContext } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHeader } from '../components/page-header'
import { PageBody } from '../components/page-body'
import { PageHeading } from '../components/page-heading'
import { Stack } from '../components/stack'
import { toast } from 'sonner'
import { cn } from '../helpers/dom'
import { signIn } from '../api/auth'
import { z } from 'zod'

const FALLBACK_ROUTE = '/' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading'>('idle')
  const router = useRouter()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  /** Submit handler for the log in form */
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

      const res = await signIn({ email, password })

      setLoginStatus('idle')

      router.update({
        context: {
          user: res.user,
          session: res.session,
        },
      })

      await router.invalidate()

      toast.success(`Signed in as ${res.user.email}`)

      await navigate({ to: search.redirect || FALLBACK_ROUTE })
    } catch (err) {
      toast.error(String(err))

      throw err
    }
  }

  return (
    <div>
      <PageHeader>
        <PageHeading>Log in</PageHeading>
      </PageHeader>

      <PageBody>
        <form onSubmit={handleSubmit}>
          <Stack className="max-w-lg">
            <FormControl>
              <FormLabel htmlFor="email-input">Email</FormLabel>

              <FormInput
                type="text"
                autoComplete="username"
                id="email-input"
                name="email"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="pw-input">Password</FormLabel>

              <FormInput
                type="password"
                autoComplete="password"
                id="pw-input"
                name="password"
                required
              />
            </FormControl>

            <button
              type="submit"
              className="h-10 bg-gradient-to-b to-indigo-600 from-indigo-500 px-5 py-2 rounded-xl focus-visible:ring-3 ring-indigo-700 focus:outline-0 font-semibold text-sm cursor-pointer text-white transition"
            >
              Log in
            </button>
          </Stack>
        </form>
      </PageBody>
    </div>
  )
}

function FormControl({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('w-full flex gap-1 flex-col', className)} {...props} />
}

function FormInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-10 text-sm flex w-full bg-white border border-slate-300 px-4 rounded-lg text-slate-700 focus:outline-0 focus-visible:ring-2 ring-indigo-700 transition',
        className,
      )}
      {...props}
    />
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label className={cn('flex text-sm font-semibold text-slate-900 00', className)} {...props} />
  )
}
