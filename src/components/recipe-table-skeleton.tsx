type RecipeTableSkeletonProps = {
  delay?: number
  showDietaryPref?: boolean
}

export function RecipeTableSkeleton({
  delay = 0,
  showDietaryPref = true,
}: RecipeTableSkeletonProps) {
  return (
    <tr
      className="border-b border-slate-200 animate-pulse"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <td className="p-4">
        <div className="h-5 w-56 bg-gray-200 rounded" />
      </td>
      {showDietaryPref && (
        <td className="p-4 hidden md:table-cell">
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </td>
      )}
      <td className="p-4 text-right">
        <span className="md:hidden h-5 w-16 bg-gray-200 rounded inline-block" />
        <div className="hidden md:inline-flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-4 h-4 bg-gray-200 rounded-full" />
          ))}
        </div>
      </td>
    </tr>
  )
}
