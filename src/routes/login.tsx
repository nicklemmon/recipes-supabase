import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '../components/button'
import { FormControl } from '../components/form-control'
import { FormInput } from '../components/form-input'
import { FormLabel } from '../components/form-label'
import { PageHeader } from '../components/page-header'
import { PageBody } from '../components/page-body'
import { PageHeading } from '../components/page-heading'
import { Stack } from '../components/stack'
import { title } from '../helpers/dom'
import { signIn } from '../api/auth'

const FALLBACK_ROUTE = '/' as const

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      {
        title: title('Log in'),
      },
    ],
  }),
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

            <Button type="submit">Log in</Button>
          </Stack>
        </form>
      </PageBody>
    </div>
  )
}
