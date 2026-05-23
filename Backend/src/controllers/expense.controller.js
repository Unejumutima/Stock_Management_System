import * as expenseService from '../services/expense.service.js'
import { sendSuccess, sendCreated, sendMessage } from '../utils/response.js'

export async function getExpenses(req, res) {
  const expenses = await expenseService.listExpenses(req.query)
  return sendSuccess(res, { expenses })
}

export async function getExpense(req, res) {
  const expense = await expenseService.getExpense(req.params.id)
  return sendSuccess(res, { expense })
}

export async function createExpense(req, res) {
  const expense = await expenseService.createExpense(req.body)
  return sendCreated(res, { expense })
}

export async function updateExpense(req, res) {
  const expense = await expenseService.updateExpense(req.params.id, req.body)
  return sendSuccess(res, { expense })
}

export async function deleteExpense(req, res) {
  await expenseService.deleteExpense(req.params.id)
  return sendMessage(res, 'Expense deleted successfully')
}

export async function getExpenseSummary(req, res) {
  const summary = await expenseService.getExpenseSummary(req.query)
  return sendSuccess(res, { summary })
}
