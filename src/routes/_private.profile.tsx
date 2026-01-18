import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../components/page-header'
import { PageHeading } from '../components/page-heading'
import { PageBody } from '../components/page-body'
import { title } from '../helpers/dom'
import { getSession } from '../api/auth'
import { Stack } from '../components/stack'

export const Route = createFileRoute('/_private/profile')({
  loader: async () => {
    const { session } = await getSession()

    return { session }
  },
  head: () => ({
    meta: [
      {
        title: title('Profile'),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = Route.useLoaderData()
  console.log('session', session)

  return (
    <div>
      <PageHeader>
        <PageHeading>Profile</PageHeading>
      </PageHeader>

      <PageBody>
        <Stack spacing="xs">
          <div className="text-md font-semibold text-slate-800 dark:text-zinc-50">User email</div>
          <div className="text-slate-600 dark:text-zinc-400">{session?.user.email}</div>
        </Stack>
      </PageBody>
    </div>
  )
}
