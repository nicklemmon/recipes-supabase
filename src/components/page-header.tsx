import { Container } from './container'
import { Stack } from './stack'

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-6 pt-14 md:pb-24 md:pt-14 bg-slate-100">
      <Container>
        <Stack>{children}</Stack>
      </Container>
    </div>
  )
}
