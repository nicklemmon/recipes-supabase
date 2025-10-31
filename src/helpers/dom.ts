import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const ROOT_SITE_TITLE = 'Lemfamy Recipes'

/** Merges/joins class names */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns site title */
export function title(titleStr?: Array<string | undefined> | string) {
  if (!titleStr) return ROOT_SITE_TITLE

  if (typeof titleStr === 'string') {
    return [titleStr, ROOT_SITE_TITLE].join(' | ')
  }

  return [...titleStr.filter(Boolean), ROOT_SITE_TITLE].join(' | ')
}
