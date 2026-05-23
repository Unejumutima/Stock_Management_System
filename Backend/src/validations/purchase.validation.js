import { body, param, query } from 'express-validator'

export const purchaseIdParam = [param('id').isUUID().withMessage('Valid purchase id is required')]

export const createPurchaseValidation = [
  body('productId').isUUID().withMessage('Valid product id is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('pricePerUnit').isFloat({ min: 0 }).withMessage('Price per unit must be >= 0'),
  body('purchaseDate').isISO8601().toDate().withMessage('Valid purchase date is required'),
]

export const listPurchaseQuery = [
  query('productId').optional().isUUID(),
  query('category').optional().isString(),
  query('from').optional().isISO8601().toDate(),
  query('to').optional().isISO8601().toDate(),
  query('search').optional().isString(),
]
