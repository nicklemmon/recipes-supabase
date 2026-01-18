import { Container } from './container'
import { Stack } from './stack'

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-6 pt-14 md:pb-20 md:pt-14 relative overflow-hidden bg-indigo-50 dark:bg-zinc-900">
      <div className="absolute inset-0 bg-linear-to-tr from-blue-100/40 via-transparent to-indigo-100/50 dark:from-transparent dark:via-transparent dark:to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-transparent dark:from-zinc-900/50 dark:via-transparent dark:to-transparent" />
      <Container className="relative">
        <Stack className="gap-6">{children}</Stack>
      </Container>
    </div>
  )
}
