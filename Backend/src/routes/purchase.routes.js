import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import {
  createPurchaseValidation,
  purchaseIdParam,
  listPurchaseQuery,
} from '../validations/purchase.validation.js'
import * as purchaseController from '../controllers/purchase.controller.js'

const router = Router()

router.use(authenticate)

router.get('/summary', listPurchaseQuery, validate, asyncHandler(purchaseController.getPurchaseSummary))
router.get('/', listPurchaseQuery, validate, asyncHandler(purchaseController.getPurchases))
router.get('/:id', purchaseIdParam, validate, asyncHandler(purchaseController.getPurchase))
router.post('/', createPurchaseValidation, validate, asyncHandler(purchaseController.createPurchase))
router.delete('/:id', purchaseIdParam, validate, asyncHandler(purchaseController.deletePurchase))

export default router
