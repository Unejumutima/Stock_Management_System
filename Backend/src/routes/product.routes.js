import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import {
  createProductValidation,
  updateProductValidation,
  productIdParam,
} from '../validations/product.validation.js'
import * as productController from '../controllers/product.controller.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(productController.getProducts))
router.get('/:id', productIdParam, validate, asyncHandler(productController.getProduct))
router.post('/', createProductValidation, validate, asyncHandler(productController.createProduct))
router.put('/:id', updateProductValidation, validate, asyncHandler(productController.updateProduct))
router.delete('/:id', productIdParam, validate, asyncHandler(productController.deleteProduct))

export default router
