import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { createSaleValidation, saleIdParam, listSaleQuery } from '../validations/sale.validation.js'
import * as saleController from '../controllers/sale.controller.js'

const router = Router()

router.use(authenticate)

router.get('/summary', listSaleQuery, validate, asyncHandler(saleController.getSaleSummary))
router.get('/', listSaleQuery, validate, asyncHandler(saleController.getSales))
router.get('/:id', saleIdParam, validate, asyncHandler(saleController.getSale))
router.post('/', createSaleValidation, validate, asyncHandler(saleController.createSale))
router.delete('/:id', saleIdParam, validate, asyncHandler(saleController.deleteSale))

export default router
