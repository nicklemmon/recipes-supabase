import { HTMLProps } from 'react'
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
      <Container className="bg-white md:translate-y-[-40px] py-8 md:p-8 md:rounded-xl shadow-lg shadow-slate-100">
        {children}
      </Container>
    </div>
  )
}
