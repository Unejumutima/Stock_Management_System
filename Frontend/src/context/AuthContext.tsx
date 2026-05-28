import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api, { setAccessToken } from '../utils/api'

export interface User {
  id: number
  email: string
  fullName: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Attempt to recover session on mount
    async function restoreSession() {
      const storedUser = localStorage.getItem('user')
      const storedRefreshToken = localStorage.getItem('refreshToken')

      if (storedUser && storedRefreshToken) {
        try {
          // Perform a silent refresh to get a valid access token
          const { data } = await api.post('/auth/refresh', { refreshToken: storedRefreshToken })
          setAccessToken(data.data.accessToken)
          if (data.data.refreshToken) {
            localStorage.setItem('refreshToken', data.data.refreshToken)
          }
          setUser(JSON.parse(storedUser))
        } catch (err) {
          console.warn('Failed to restore session:', err)
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          setAccessToken(null)
        }
      }
      setLoading(false)
    }

    restoreSession()

    // Listen to global logout events triggered by interceptor failures
    const handleLogoutEvent = () => {
      setUser(null)
    }
    window.addEventListener('logout', handleLogoutEvent)

    return () => {
      window.removeEventListener('logout', handleLogoutEvent)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const { accessToken, refreshToken, user: userData } = data.data

      setAccessToken(accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg)
      throw new Error(msg)
    }
  }

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    try {
      if (storedRefreshToken) {
        await api.post('/auth/logout', { refreshToken: storedRefreshToken })
      }
    } catch (err) {
      console.error('Logout error on backend:', err)
    } finally {
      setAccessToken(null)
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
