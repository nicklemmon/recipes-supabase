/**
 * Converts a given string into a URL-friendly slug.
 *
 * Steps:
 *   1. Normalize to NFD form to separate diacritics
 *   2. Remove diacritical marks (accents)
 *   3. Convert to lowercase
 *   4. Trim leading/trailing whitespace
 *   5. Replace spaces and underscores with hyphens
 *   6. Remove any non-alphanumeric characters except hyphens
 *   7. Collapse consecutive hyphens into one
 *   8. Remove leading/trailing hyphens
 *
 * @param str - The string to slugify
 * @returns A URL-safe slug
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD') // 1. decompose combined letters + diacritics
    .replace(/[\u0300-\u036f]/g, '') // 2. strip diacritical marks
    .toLowerCase() // 3. lowercase
    .trim() // 4. trim surrounding whitespace
    .replace(/[\s_]+/g, '-') // 5. spaces/underscores → hyphens
    .replace(/[^a-z0-9-]+/g, '') // 6. remove invalid chars
    .replace(/--+/g, '-') // 7. collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // 8. trim hyphens at ends
}
