import type React from 'react'

/** Visually hides children while keeping them available to screen readers */
export function SrOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}
