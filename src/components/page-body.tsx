import { cn } from '../helpers/dom'
import { Container } from './container'

export function PageBody({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('', className)}>
      <Container className="bg-white md:translate-y-[-40px] py-8 md:p-8 md:rounded-3xl shadow-lg shadow-slate-100 border border-slate-100">
        {children}
      </Container>
    </div>
  )
}
