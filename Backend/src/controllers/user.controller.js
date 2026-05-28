import * as userModel from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { sendSuccess, sendCreated } from '../utils/response.js'

export async function getAllUsers(req, res) {
  const users = await userModel.getAllUsers()
  return sendSuccess(res, { users })
}

export async function getUserById(req, res) {
  const { id } = req.params
  const user = await userModel.getUserById(id)
  if (!user) {
    throw ApiError.notFound('User not found')
  }
  return sendSuccess(res, { user })
}

export async function createUser(req, res) {
  const { email, fullName, role = 'user', isApproved = true } = req.body
  
  const existing = await userModel.getUserByEmail(email)
  if (existing) {
    throw ApiError.conflict('Email already registered')
  }
  
  const user = await userModel.createUser({ email, fullName, role, isApproved })
  return sendCreated(res, { user })
}

export async function updateUser(req, res) {
  const { id } = req.params
  const { email, fullName, role, isApproved } = req.body
  
  const existing = await userModel.getUserById(id)
  if (!existing) {
    throw ApiError.notFound('User not found')
  }
  
  if (email && email.toLowerCase() !== existing.email.toLowerCase()) {
    const emailExists = await userModel.getUserByEmail(email)
    if (emailExists) {
      throw ApiError.conflict('Email already registered')
    }
  }
  
  const user = await userModel.updateUser(id, { email, fullName, role, isApproved })
  return sendSuccess(res, { user })
}

export async function deleteUser(req, res) {
  const { id } = req.params
  
  if (id === req.user.id) {
    throw ApiError.badRequest('Cannot delete your own account')
  }
  
  const existing = await userModel.getUserById(id)
  if (!existing) {
    throw ApiError.notFound('User not found')
  }
  
  await userModel.deleteUser(id)
  return sendSuccess(res, { message: 'User deleted successfully' })
}

export async function updateUserApproval(req, res) {
  const { id } = req.params
  const { isApproved } = req.body
  
  const existing = await userModel.getUserById(id)
  if (!existing) {
    throw ApiError.notFound('User not found')
  }
  
  const user = await userModel.updateUserApproval(id, isApproved)
  return sendSuccess(res, { user })
}
