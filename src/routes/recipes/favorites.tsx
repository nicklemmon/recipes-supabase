import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../../components/page-header'
import { PageHeading } from '../../components/page-heading'
import { PageBody } from '../../components/page-body'
import { title } from '../../helpers/dom'

export const Route = createFileRoute('/recipes/favorites')({
  head: () => ({
    meta: [
      {
        title: title(['Favorites', 'Recipes']),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PageHeader>
        <PageHeading>Favorites</PageHeading>
      </PageHeader>

      <PageBody></PageBody>
    </div>
  )
}
