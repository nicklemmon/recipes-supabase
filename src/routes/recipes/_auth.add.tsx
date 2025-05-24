import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { PageBody } from '../../components/page-body'

export const Route = createFileRoute('/recipes/_auth/add')({
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
