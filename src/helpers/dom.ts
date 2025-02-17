import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merges/joins class names */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
