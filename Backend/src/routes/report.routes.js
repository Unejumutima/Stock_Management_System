import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authenticate } from '../middleware/auth.js'
import * as reportController from '../controllers/report.controller.js'

const router = Router()

router.use(authenticate)

router.get('/monthly', asyncHandler(reportController.getMonthlyReport))
router.get('/monthly/export', asyncHandler(reportController.exportMonthlyReport))

export default router
