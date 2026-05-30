import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authenticate } from '../middleware/auth.js'
import * as inventoryController from '../controllers/inventory.controller.js'

const router = Router()

router.use(authenticate)

router.get('/overview', asyncHandler(inventoryController.getInventoryOverview))
router.get('/low-stock', asyncHandler(inventoryController.getLowStock))
router.get('/export', asyncHandler(inventoryController.exportInventory))
router.get('/', asyncHandler(inventoryController.getInventory))

export default router
