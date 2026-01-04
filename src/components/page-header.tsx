import { Container } from './container'
import { Stack } from './stack'

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-6 pt-14 md:pb-20 md:pt-14 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-transparent to-indigo-100/50 dark:from-indigo-950/40 dark:via-transparent dark:to-indigo-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-transparent dark:from-indigo-900/30 dark:via-transparent dark:to-transparent" />
      <Container className="relative">
        <Stack className="gap-6">{children}</Stack>
      </Container>
    </div>
  )
}
