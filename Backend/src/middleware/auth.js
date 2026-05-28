import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

/**
 * Protects routes — expects header: Authorization: Bearer <token>
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access token required'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.jwt.secret)
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      fullName: decoded.fullName,
    }
    next()
  } catch {
    return next(ApiError.unauthorized('Invalid or expired token'))
  }
}

/**
 * Restricts routes to admin users only
 */
export function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'))
  }
  next()
}
