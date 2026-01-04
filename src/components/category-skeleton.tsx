export function CategoryLinkSkeleton() {
  return (
    <div className="h-42 w-full flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg shadow-gray-100/50 dark:shadow-slate-950/30 rounded-4xl animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full" />
        <div className="w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  )
}
