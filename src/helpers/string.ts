/**
 * Converts a given string into a URL-friendly slug.
 *
 * Steps:
 *   1. Normalize to NFD form to separate diacritics
 *   2. Remove diacritical marks (accents)
 *   3. Convert to lowercase
 *   4. Trim leading/trailing whitespace
 *   5. Remove or replace apostrophes (contractions kept, possessives removed)
 *   6. Replace spaces and underscores with hyphens
 *   7. Remove any non-alphanumeric characters except hyphens
 *   8. Collapse consecutive hyphens into one
 *   9. Remove leading/trailing hyphens
 *
 * @param str - The string to slugify
 * @returns A URL-safe slug
 *
 * @example
 * slugify("It's a beautiful day!") // "its-a-beautiful-day"
 * slugify("John's car") // "johns-car"
 * slugify("rock 'n' roll") // "rock-n-roll"
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD') // 1. decompose combined letters + diacritics
    .replace(/[\u0300-\u036f]/g, '') // 2. strip diacritical marks
    .toLowerCase() // 3. lowercase
    .trim() // 4. trim surrounding whitespace
    .replace(/[''`]/g, '') // 5. remove apostrophes/quotes
    .replace(/[\s_]+/g, '-') // 6. spaces/underscores → hyphens
    .replace(/[^a-z0-9-]+/g, '') // 7. remove invalid chars
    .replace(/--+/g, '-') // 8. collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // 9. trim hyphens at ends
}
