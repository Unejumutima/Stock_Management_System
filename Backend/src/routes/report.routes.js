import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import * as reportController from '../controllers/report.controller.js'

const router = Router()

// Reports are admin-only
router.use(authenticate)
router.use(requireAdmin)

router.get('/monthly', asyncHandler(reportController.getMonthlyReport))
router.get('/monthly/export', asyncHandler(reportController.exportMonthlyReport))

export default router
