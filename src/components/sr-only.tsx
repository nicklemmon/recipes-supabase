import type React from 'react'

export function SrOnly({ children }: { children: React.ReactNode }) {
  return <div className="sr-only">{children}</div>
}
