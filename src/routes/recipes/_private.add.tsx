import { createFileRoute, redirect } from '@tanstack/react-router'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { PageBody } from '../../components/page-body'
import { title } from '../../helpers/dom'

export const Route = createFileRoute('/recipes/_private/add')({
  head: () => ({
    meta: [
      {
        title: title(['Add recipe', 'Recipes']),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PageHeader>
        <PageHeading>Add recipe</PageHeading>
      </PageHeader>

      <PageBody></PageBody>
    </div>
  )
}
