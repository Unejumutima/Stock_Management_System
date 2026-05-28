import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import * as userController from '../controllers/user.controller.js'

const router = Router()

// All user management routes require authentication
router.use(authenticate)

// Admin-only routes
router.get('/', requireAdmin, asyncHandler(userController.getAllUsers))
router.post('/', requireAdmin, asyncHandler(userController.createUser))
router.put('/:id', requireAdmin, asyncHandler(userController.updateUser))
router.delete('/:id', requireAdmin, asyncHandler(userController.deleteUser))
router.patch('/:id/approval', requireAdmin, asyncHandler(userController.updateUserApproval))

// Users can view their own profile
router.get('/:id', asyncHandler(userController.getUserById))

export default router
