export type Expense = {
  id: string
  category: string
  description: string
  amount: number
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Logistics & freight',
  'Utilities',
  'Payroll',
  'Marketing',
  'Warehouse & rent',
  'Other',
] as const

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', category: 'Logistics & freight', description: 'Kigali hub inbound freight', amount: 4200, date: '2026-05-03' },
  { id: 'exp-2', category: 'Utilities', description: 'Cold storage electricity — May', amount: 1850, date: '2026-05-05' },
  { id: 'exp-3', category: 'Payroll', description: 'Warehouse team payroll (cycle 1)', amount: 12400, date: '2026-05-08' },
  { id: 'exp-4', category: 'Marketing', description: 'Wholesale buyer outreach campaign', amount: 2100, date: '2026-05-10' },
  { id: 'exp-5', category: 'Warehouse & rent', description: 'Gikondo warehouse lease', amount: 5600, date: '2026-05-12' },
  { id: 'exp-6', category: 'Other', description: 'Packaging supplies replenishment', amount: 980, date: '2026-05-14' },
  { id: 'exp-7', category: 'Logistics & freight', description: 'Regional distribution — April', amount: 3900, date: '2026-04-15' },
  { id: 'exp-8', category: 'Payroll', description: 'Operations payroll — April', amount: 11800, date: '2026-04-20' },
  { id: 'exp-9', category: 'Utilities', description: 'Utilities — April', amount: 1720, date: '2026-04-22' },
  { id: 'exp-10', category: 'Marketing', description: 'Trade fair booth — Q2', amount: 3400, date: '2026-03-18' },
]
