import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import * as authModel from '../models/auth.model.js'
import * as refreshTokenModel from '../models/refreshToken.model.js'

/**
 * Auth service — business logic: verify credentials, issue JWT.
 */

export function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name || user.fullName,
      jti: crypto.randomUUID(),
    },
    env.jwt.secret,
    { expiresIn: env.jwt.accessExpiresIn }
  )
}

export function signRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name || user.fullName,
      jti: crypto.randomUUID(),
    },
    env.jwt.secret,
    { expiresIn: env.jwt.refreshExpiresIn }
  )
}

export async function login(email, password) {
  const user = await authModel.findUserByEmail(email)
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  // Save the refresh token in the database
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await refreshTokenModel.createRefreshToken(user.id, refreshToken, expiresAt)

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
  }
}

export async function register({ email, password, fullName }) {
  const existing = await authModel.findUserByEmail(email)
  if (existing) {
    throw ApiError.conflict('Email already registered')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await authModel.createUser({ email, passwordHash, fullName })

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await refreshTokenModel.createRefreshToken(user.id, refreshToken, expiresAt)

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
  }
}

export async function refreshTokens(refreshTokenVal) {
  let decoded
  try {
    decoded = jwt.verify(refreshTokenVal, env.jwt.secret)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Refresh token expired')
    }
    throw ApiError.unauthorized('Invalid refresh token')
  }

  const tokenRecord = await refreshTokenModel.findRefreshToken(refreshTokenVal)
  if (!tokenRecord) {
    throw ApiError.unauthorized('Invalid refresh token')
  }

  if (tokenRecord.is_revoked) {
    throw ApiError.unauthorized('Refresh token is revoked')
  }

  if (tokenRecord.is_used) {
    // Replay attack! Revoke all tokens for this user for security
    await refreshTokenModel.revokeAllUserTokens(tokenRecord.user_id)
    throw ApiError.unauthorized('Refresh token has already been used. Access revoked.')
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    throw ApiError.unauthorized('Refresh token expired')
  }

  // Token is valid! Mark it as used.
  await refreshTokenModel.markAsUsed(refreshTokenVal)

  // Generate new tokens (rotation)
  const user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
    fullName: decoded.fullName,
  }

  const newAccessToken = signAccessToken(user)
  const newRefreshToken = signRefreshToken(user)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await refreshTokenModel.createRefreshToken(user.id, newRefreshToken, expiresAt)

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }
}

export async function logout(refreshTokenVal) {
  const tokenRecord = await refreshTokenModel.findRefreshToken(refreshTokenVal)
  if (tokenRecord) {
    await refreshTokenModel.revokeToken(refreshTokenVal)
  }
}


export async function getProfile(userId) {
  const user = await authModel.findUserById(userId)
  if (!user) throw ApiError.notFound('User not found')
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
  }
}
