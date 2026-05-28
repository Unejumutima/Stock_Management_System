import * as authService from '../services/auth.service.js'
import { sendSuccess, sendCreated, sendMessage } from '../utils/response.js'
import * as refreshTokenModel from '../models/refreshToken.model.js'


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

export async function googleCallback(req, res) {
  // Passport sets req.user on success; on failure it redirects via failureRedirect
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`)
  }

  const user = req.user

  // Generate JWT tokens
  const accessToken = authService.signAccessToken(user)
  const refreshToken = authService.signRefreshToken(user)

  // Persist refresh token
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  await refreshTokenModel.createRefreshToken(user.id, refreshToken, expiresAt)

  // Redirect to the frontend OAuth callback route with tokens in query params
  const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`
  res.redirect(redirectUrl)
}

