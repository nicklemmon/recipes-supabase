import { Star } from 'lucide-react'
import type { Recipe } from '../types/recipes'
import { EmptyCell } from './empty-cell'
import { Inline } from './inline'

/** Shows a rating with optional smaller stars on narrow screens. */
export function RecipeRating({
  rating,
  compactOnMobile = false,
}: {
  rating: Recipe['rating']
  compactOnMobile?: boolean
}) {
  if (rating == null) return <EmptyCell label="No rating" />

  return (
    <div role="img" aria-label={`${rating} out of 5 stars`}>
      {compactOnMobile && (
        <Inline spacing="0" className="flex-nowrap gap-0.5 md:hidden" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={12}
              className={
                index < rating
                  ? 'shrink-0 text-yellow-500 fill-yellow-200'
                  : 'shrink-0 text-slate-300 dark:text-zinc-600'
              }
            />
          ))}
        </Inline>
      )}

      <Inline
        spacing="xs"
        className={compactOnMobile ? 'hidden flex-nowrap md:inline-flex' : 'flex-nowrap'}
        aria-hidden="true"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < rating
                ? 'shrink-0 text-yellow-500 fill-yellow-200'
                : 'shrink-0 text-slate-300 dark:text-zinc-600'
            }
          />
        ))}
      </Inline>
    </div>
  )
}
