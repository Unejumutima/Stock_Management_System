import api from '../utils/api'

export interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'user'
  googleId: string | null
  isApproved: boolean
  createdAt: string
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get('/users')
  return data.data.users
}

export async function createUser(payload: {
  email: string
  fullName: string
  role: 'admin' | 'user'
  isApproved: boolean
}): Promise<User> {
  const { data } = await api.post('/users', payload)
  return data.data.user
}

export async function updateUser(
  id: string,
  payload: {
    email?: string
    fullName?: string
    role?: 'admin' | 'user'
    isApproved?: boolean
  }
): Promise<User> {
  const { data } = await api.put(`/users/${id}`, payload)
  return data.data.user
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}

export async function updateUserApproval(id: string, isApproved: boolean): Promise<User> {
  const { data } = await api.patch(`/users/${id}/approval`, { isApproved })
  return data.data.user
}
