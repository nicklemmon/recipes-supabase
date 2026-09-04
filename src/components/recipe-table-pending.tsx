import { RecipeTableSkeleton } from './recipe-table-skeleton'

type RecipeTablePendingProps = {
  showDietaryPref?: boolean
  caption?: string
}

/** Route pending UI for recipe list tables. */
export function RecipeTablePending({
  showDietaryPref = true,
  caption = 'Recipes',
}: RecipeTablePendingProps) {
  return (
    <div
      aria-busy="true"
      aria-label={`Loading ${caption.toLowerCase()}`}
      className="border border-x-0 border-slate-200 dark:border-slate-700 w-full"
    >
      <table className="w-full text-left text-md border-collapse text-slate-700 dark:text-slate-300">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b-2 border-slate-200 dark:border-slate-700">
          <tr>
            <th className="font-medium p-4 dark:text-slate-200">Recipe</th>
            <th
              className={`font-medium p-4 dark:text-slate-200 ${showDietaryPref ? 'hidden md:table-cell' : ''}`}
            >
              Dietary pref.
            </th>
            <th className="font-medium p-4 text-right dark:text-slate-200">Rating</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <RecipeTableSkeleton key={index} showDietaryPref={showDietaryPref} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
