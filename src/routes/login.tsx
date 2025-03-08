import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../components/page-header'
import { PageBody } from '../components/page-body'
import { PageHeading } from '../components/page-heading'
import { Stack } from '../components/stack'
import { InputHTMLAttributes } from 'react'
import { cn } from '../helpers/dom'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PageHeader>
        <PageHeading>Log in</PageHeading>
      </PageHeader>

      <PageBody>
        <form>
          <Stack className="max-w-xl">
            <FormControl>
              <FormLabel htmlFor="username-input">Username</FormLabel>

              <FormInput type="text" autoComplete="username" id="username-input" />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="pw-input">Password</FormLabel>

              <FormInput type="password" autoComplete="username" id="pw-input" />
            </FormControl>

            <button
              type="submit"
              className="bg-indigo-500 px-5 py-2 rounded-lg font-semibold text-sm cursor-pointer text-white"
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
        'flex w-full bg-slate-50 border border-slate-300 p-2 rounded-lg text-slate-700 focus:outline-0 focus-visible:ring-2',
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
