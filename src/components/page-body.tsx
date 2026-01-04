import { Container } from './container'
import { cn } from '../helpers/dom'

export function PageBody({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('', className)}>
      <Container className="bg-white dark:bg-slate-900 md:translate-y-[-40px] py-8 md:p-8 md:rounded-3xl shadow-lg shadow-slate-100 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800">
        {children}
      </Container>
    </div>
  )
}
