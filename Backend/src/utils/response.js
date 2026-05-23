/**
 * Consistent JSON response helpers for all controllers.
 */

export function sendSuccess(res, data, statusCode = 200, meta = null) {
  const body = { success: true, data }
  if (meta) body.meta = meta
  return res.status(statusCode).json(body)
}

export function sendCreated(res, data) {
  return sendSuccess(res, data, 201)
}

export function sendMessage(res, message, statusCode = 200) {
  return res.status(statusCode).json({ success: true, message })
}
