import { body, param, query } from 'express-validator'

export const saleIdParam = [
  // Accept both UUID and integer IDs
  param('id').notEmpty().withMessage('Sale id is required'),
]

export const createSaleValidation = [
  // productId can be UUID or integer — just require it to be non-empty
  body('productId').notEmpty().withMessage('Product id is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('saleDate').isISO8601().toDate().withMessage('Valid sale date is required'),
  body('sellingPrice').optional().isFloat({ min: 0 }),
]

export const listSaleQuery = [
  query('productId').optional().notEmpty(),
  query('category').optional().isString(),
  query('from').optional().isISO8601().toDate(),
  query('to').optional().isISO8601().toDate(),
  query('search').optional().isString(),
]
