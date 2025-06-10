/**
 * Convert an ISO timestamp (with offset) into a human-readable date/time
 * in the visitor’s locale and timezone.
 *
 * @param isoTimestamp - e.g. "2025-05-25T17:36:16.263769+00:00"
 * @param locale       - optional BCP-47 locale, defaults to the browser’s setting
 * @returns            - e.g. "May 25, 2025, 1:36 PM EDT" (depending on user TZ)
 */
export function toLegibleDate(isoTimestamp: string, locale: string = navigator.language): string {
  const date = new Date(isoTimestamp)

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}
