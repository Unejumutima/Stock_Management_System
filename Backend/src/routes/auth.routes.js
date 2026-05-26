import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { loginValidation, registerValidation, refreshValidation, logoutValidation } from '../validations/auth.validation.js'
import * as authController from '../controllers/auth.controller.js'

const router = Router()

router.post('/login', loginValidation, validate, asyncHandler(authController.login))
router.post('/register', registerValidation, validate, asyncHandler(authController.register))
router.get('/me', authenticate, asyncHandler(authController.me))
router.post('/refresh', refreshValidation, validate, asyncHandler(authController.refresh))
router.post('/logout', logoutValidation, validate, asyncHandler(authController.logout))

export default router
