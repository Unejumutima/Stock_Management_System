import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authenticate } from '../middleware/auth.js'
import * as dashboardController from '../controllers/dashboard.controller.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(dashboardController.getDashboard))

export default router
