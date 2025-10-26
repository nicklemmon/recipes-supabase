type CategoryLinkSkeletonProps = {
  delay?: number
}

export function CategoryLinkSkeleton({ delay = 0 }: CategoryLinkSkeletonProps) {
  return (
    <div
      className="h-42 w-full flex flex-col justify-center items-center bg-gray-100 border border-gray-200 shadow-lg shadow-gray-100/50 rounded-4xl animate-pulse"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  )
}
