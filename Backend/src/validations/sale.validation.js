import { body, param, query } from 'express-validator'

export const saleIdParam = [param('id').isUUID().withMessage('Valid sale id is required')]

export const createSaleValidation = [
  body('productId').isUUID().withMessage('Valid product id is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('saleDate').isISO8601().toDate().withMessage('Valid sale date is required'),
  body('sellingPrice').optional().isFloat({ min: 0 }),
]

export const listSaleQuery = [
  query('productId').optional().isUUID(),
  query('category').optional().isString(),
  query('from').optional().isISO8601().toDate(),
  query('to').optional().isISO8601().toDate(),
  query('search').optional().isString(),
]
