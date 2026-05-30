import { body, param } from 'express-validator'

export const productIdParam = [param('id').isUUID().withMessage('Valid product id is required')]

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('purchasePrice').isFloat({ min: 0 }).withMessage('Purchase price must be >= 0'),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be >= 0'),
  body('initialStock').optional().isInt({ min: 0 }).withMessage('Initial stock must be a non-negative integer'),
]

export const updateProductValidation = [
  ...productIdParam,
  body('name').optional().trim().notEmpty(),
  body('sku').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('purchasePrice').optional().isFloat({ min: 0 }),
  body('sellingPrice').optional().isFloat({ min: 0 }),
]
