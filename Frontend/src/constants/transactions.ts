export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'month', label: 'This month' },
] as const

export type DateRangeValue = (typeof DATE_RANGE_OPTIONS)[number]['value']
/**
 * Accepts a string, Date object, or null/undefined.
 * PostgreSQL date columns come back as Date objects via the pg driver,
 * so we handle both types here.
 */
export function parseISODate(value: string | Date | null | undefined): Date {
  if (!value) return new Date(NaN)

  // Already a Date object (pg driver returns dates this way)
  if (value instanceof Date) return value

  // ISO string like "2026-05-15" or "2026-05-15T00:00:00.000Z"
  // Force UTC interpretation for plain date strings to avoid timezone shifts
  const str = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    // "YYYY-MM-DD" — parse as UTC noon to avoid off-by-one from local timezone
    return new Date(`${str}T12:00:00.000Z`)
  }

  const d = new Date(str)
  return d
}

export function todayISO(): string {
  const n = new Date()
  const m = String(n.getMonth() + 1).padStart(2, '0')
  const d = String(n.getDate()).padStart(2, '0')
  return `${n.getFullYear()}-${m}-${d}`
}

export function isWithinDateRange(
  value: string | Date | null | undefined,
  range: DateRangeValue,
  now = new Date(),
): boolean {
  if (range === 'all') return true
  const date = parseISODate(value)
  if (Number.isNaN(date.getTime())) return false
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  if (range === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }
  const start = new Date(end)
  start.setDate(start.getDate() - (range === '7d' ? 7 : 30))
  start.setHours(0, 0, 0, 0)
  return date >= start && date <= end
}

export function isThisMonth(value: string | Date | null | undefined, now = new Date()): boolean {
  return isWithinDateRange(value, 'month', now)
}

export function formatDisplayDate(value: string | Date | null | undefined): string {
  const date = parseISODate(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC', // use UTC so "2026-05-15T12:00:00Z" shows May 15, not May 14
  }).format(date)
}
