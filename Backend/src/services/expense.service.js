import { ApiError } from '../utils/ApiError.js'
import * as expenseModel from '../models/expense.model.js'
import { mapExpense } from '../utils/transform.js'

export async function listExpenses(query) {
  const rows = await expenseModel.findAll({
    category: query.category,
    from: query.from,
    to: query.to,
    search: query.search,
  })
  return rows.map(mapExpense)
}

export async function getExpense(id) {
  const row = await expenseModel.findById(id)
  if (!row) throw ApiError.notFound('Expense not found')
  return mapExpense(row)
}

export async function createExpense(body) {
  const row = await expenseModel.create({
    category: body.category,
    amount: body.amount,
    expenseDate: body.expenseDate,
    notes: body.notes,
  })
  return mapExpense(row)
}

export async function updateExpense(id, body) {
  const existing = await expenseModel.findById(id)
  if (!existing) throw ApiError.notFound('Expense not found')
  const row = await expenseModel.update(id, {
    category: body.category,
    amount: body.amount,
    expenseDate: body.expenseDate,
    notes: body.notes,
  })
  return mapExpense(row)
}

export async function deleteExpense(id) {
  const deleted = await expenseModel.remove(id)
  if (!deleted) throw ApiError.notFound('Expense not found')
}

export async function getExpenseSummary(query) {
  const summary = await expenseModel.getSummary({ from: query.from, to: query.to })
  const count = Number(summary.total_count)
  return {
    totalCount: count,
    totalAmount: Number(summary.total_amount),
    averageExpense: count > 0 ? Number(summary.total_amount) / count : 0,
    topCategory: summary.top_category,
    topCategoryAmount: Number(summary.top_category_amount),
  }
}
