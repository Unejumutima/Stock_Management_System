import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import passport from '../config/passport.js'
import { loginValidation, registerValidation, refreshValidation, logoutValidation } from '../validations/auth.validation.js'
import * as authController from '../controllers/auth.controller.js'

const router = Router()

router.post('/login', loginValidation, validate, asyncHandler(authController.login))
router.post('/register', registerValidation, validate, asyncHandler(authController.register))
router.get('/me', authenticate, asyncHandler(authController.me))
router.post('/refresh', refreshValidation, validate, asyncHandler(authController.refresh))
router.post('/logout', logoutValidation, validate, asyncHandler(authController.logout))

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) return next(err)
      if (!user) {
        // info.message is 'not_approved' or similar
        const reason = info?.message || 'oauth_failed'
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(reason)}`)
      }
      req.user = user
      next()
    })(req, res, next)
  },
  asyncHandler(authController.googleCallback),
)

export default router
