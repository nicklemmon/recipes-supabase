import { CategoryLinkSkeleton } from './category-skeleton'

const GRID_CLASSES = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'

/** Route pending UI for category / subcategory grids. */
export function CategoryGridPending() {
  return (
    <div className={GRID_CLASSES}>
      {Array.from({ length: 6 }).map((_, index) => (
        <CategoryLinkSkeleton key={index} />
      ))}
    </div>
  )
}
