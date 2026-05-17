export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'month', label: 'This month' },
] as const

export type DateRangeValue = (typeof DATE_RANGE_OPTIONS)[number]['value']

export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function todayISO(): string {
  const n = new Date()
  const m = String(n.getMonth() + 1).padStart(2, '0')
  const d = String(n.getDate()).padStart(2, '0')
  return `${n.getFullYear()}-${m}-${d}`
}

export function isWithinDateRange(dateStr: string, range: DateRangeValue, now = new Date()): boolean {
  if (range === 'all') return true
  const date = parseISODate(dateStr)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  if (range === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }
  const start = new Date(end)
  start.setDate(start.getDate() - (range === '7d' ? 7 : 30))
  start.setHours(0, 0, 0, 0)
  return date >= start && date <= end
}

export function isThisMonth(dateStr: string, now = new Date()): boolean {
  return isWithinDateRange(dateStr, 'month', now)
}

export function formatDisplayDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parseISODate(dateStr))
}
