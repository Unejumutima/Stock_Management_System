import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'


export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'
  let details = err.details || null

  // PostgreSQL unique violation
  if (err.code === '23505') {
    statusCode = 409
    // Detect product SKU duplicates specifically
    if (err.detail && err.detail.toLowerCase().includes('sku')) {
      message = 'Duplicate Product Detected'
      details = 'This product is already in your inventory. Update the existing product instead of creating a new one.'
    } else {
      message = 'Duplicate value violates unique constraint'
      if (err.detail) details = err.detail
    }
  }

  // Foreign key violation
  if (err.code === '23503') {
    statusCode = 400
    message = 'Referenced record does not exist'
  }

  // Validation errors from express-validator
  if (err.array && typeof err.array === 'function') {
    statusCode = 400
    message = 'Validation failed'
    details = err.array()
  }

  if (!(err instanceof ApiError) && statusCode === 500 && env.nodeEnv === 'production') {
    message = 'Internal server error'
    details = null
  }

  if (env.nodeEnv === 'development') {
    console.error('[error]', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  })
}

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}
