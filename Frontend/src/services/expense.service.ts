/**
 * Expense service — wraps all calls to /api/expenses
 * Backend returns: id, category, amount, expenseDate, notes, description
 */
import api from '../utils/api'

export interface Expense {
  id: number
  category: string
  amount: number
  expenseDate: string
  notes: string
  description: string // alias for notes, set by backend transform
}

export interface ExpenseSummary {
  totalCount: number
  totalAmount: number
  averageExpense: number
  topCategory: string
  topCategoryAmount: number
}

export interface CreateExpensePayload {
  category: string
  amount: number
  expenseDate: string
  notes?: string
}

export interface UpdateExpensePayload extends Partial<CreateExpensePayload> {}

/** Fetch all expenses, optionally filtered */
export async function fetchExpenses(params?: {
  category?: string
  from?: string
  to?: string
  search?: string
}): Promise<Expense[]> {
  const { data } = await api.get('/expenses', { params })
  return data.data.expenses
}

/** Fetch expense summary (totals, top category) */
export async function fetchExpenseSummary(params?: { from?: string; to?: string }): Promise<ExpenseSummary> {
  const { data } = await api.get('/expenses/summary', { params })
  return data.data.summary
}

/** Create a new expense */
export async function createExpense(payload: CreateExpensePayload): Promise<Expense> {
  const { data } = await api.post('/expenses', payload)
  return data.data.expense
}

/** Delete an expense by id */
export async function deleteExpense(id: number): Promise<void> {
  await api.delete(`/expenses/${id}`)
}
