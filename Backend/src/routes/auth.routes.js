import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { loginValidation, registerValidation } from '../validations/auth.validation.js'
import * as authController from '../controllers/auth.controller.js'

const router = Router()

router.post('/login', loginValidation, validate, asyncHandler(authController.login))
router.post('/register', registerValidation, validate, asyncHandler(authController.register))
router.get('/me', authenticate, asyncHandler(authController.me))

export default router
