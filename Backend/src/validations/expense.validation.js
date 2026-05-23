import { body, param, query } from 'express-validator'

export const expenseIdParam = [param('id').isUUID().withMessage('Valid expense id is required')]

export const createExpenseValidation = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('expenseDate').isISO8601().toDate().withMessage('Valid expense date is required'),
  body('notes').optional().trim(),
]

export const updateExpenseValidation = [
  ...expenseIdParam,
  body('category').optional().trim().notEmpty(),
  body('amount').optional().isFloat({ min: 0.01 }),
  body('expenseDate').optional().isISO8601().toDate(),
  body('notes').optional().trim(),
]

export const listExpenseQuery = [
  query('category').optional().isString(),
  query('from').optional().isISO8601().toDate(),
  query('to').optional().isISO8601().toDate(),
  query('search').optional().isString(),
]
