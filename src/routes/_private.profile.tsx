import { createFileRoute } from '@tanstack/react-router'

import { getSession } from '../api/auth'
import { PageBody } from '../components/page-body'
import { PageHeader } from '../components/page-header'
import { PageHeading } from '../components/page-heading'
import { Stack } from '../components/stack'
import { title } from '../helpers/dom'

export const Route = createFileRoute('/_private/profile')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: title('Profile'),
      },
    ],
  }),
  loader: async () => {
    const { session } = await getSession()

    return { session }
  },
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
          <div className="text-md font-semibold text-slate-800">User email</div>
          <div className="text-slate-600">{session?.user.email}</div>
        </Stack>
      </PageBody>
    </div>
  )
}
