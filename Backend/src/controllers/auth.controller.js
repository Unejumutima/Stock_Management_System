import * as authService from '../services/auth.service.js'
import { sendSuccess, sendCreated, sendMessage } from '../utils/response.js'


export async function login(req, res) {
  const { email, password } = req.body
  const result = await authService.login(email, password)
  return sendSuccess(res, result)
}

export async function register(req, res) {
  const result = await authService.register(req.body)
  return sendCreated(res, result)
}

export async function me(req, res) {
  const user = await authService.getProfile(req.user.id)
  return sendSuccess(res, { user })
}

export async function refresh(req, res) {
  const { refreshToken } = req.body
  const result = await authService.refreshTokens(refreshToken)
  return sendSuccess(res, result)
}

export async function logout(req, res) {
  const { refreshToken } = req.body
  await authService.logout(refreshToken)
  return sendMessage(res, 'Logged out successfully')
}

