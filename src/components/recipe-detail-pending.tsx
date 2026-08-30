import { PageBody } from './page-body'
import { PageHeader } from './page-header'
import { Stack } from './stack'

/** Route pending UI for recipe detail / edit shells. */
export function RecipeDetailPending() {
  return (
    <div>
      <PageHeader>
        <div className="h-8 w-64 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
      </PageHeader>
      <PageBody>
        <Stack spacing="lg">
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-40 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
        </Stack>
      </PageBody>
    </div>
  )
}
