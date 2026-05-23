import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import * as authModel from '../models/auth.model.js'

/**
 * Auth service — business logic: verify credentials, issue JWT.
 */

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name || user.fullName,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn },
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

  const token = signToken(user)
  return {
    token,
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
  const token = signToken(user)

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
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
