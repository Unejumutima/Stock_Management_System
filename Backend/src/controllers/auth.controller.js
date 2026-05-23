import * as authService from '../services/auth.service.js'
import { sendSuccess, sendCreated } from '../utils/response.js'


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
