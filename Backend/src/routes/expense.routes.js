import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import {
  createExpenseValidation,
  updateExpenseValidation,
  expenseIdParam,
  listExpenseQuery,
} from '../validations/expense.validation.js'
import * as expenseController from '../controllers/expense.controller.js'

const router = Router()

router.use(authenticate)

router.get('/summary', listExpenseQuery, validate, asyncHandler(expenseController.getExpenseSummary))
router.get('/', listExpenseQuery, validate, asyncHandler(expenseController.getExpenses))
router.get('/:id', expenseIdParam, validate, asyncHandler(expenseController.getExpense))
router.post('/', createExpenseValidation, validate, asyncHandler(expenseController.createExpense))
router.put('/:id', updateExpenseValidation, validate, asyncHandler(expenseController.updateExpense))
router.delete('/:id', expenseIdParam, validate, asyncHandler(expenseController.deleteExpense))

export default router
