/** Constrains/centers content for consistency/alignment throughout a page layout */
export function Container({ children }: { children?: React.ReactNode }) {
  return <div className="max-w-[1000px] mx-auto w-full px-4">{children}</div>
}
