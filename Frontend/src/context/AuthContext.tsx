import { createContext, useContext, useState, useEffect} from 'react'
import type { ReactNode } from 'react'
import api, { setAccessToken } from '../utils/api'

export interface User {
  id: string
  email: string
  fullName: string
  role: string
  isApproved?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<void>
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
    async function restoreSession() {
      const storedUser = localStorage.getItem('user')
      const storedRefreshToken = localStorage.getItem('refreshToken')

      if (storedUser && storedRefreshToken) {
        try {
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

    const handleLogoutEvent = () => setUser(null)
    window.addEventListener('logout', handleLogoutEvent)
    return () => window.removeEventListener('logout', handleLogoutEvent)
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

  /**
   * Called after Google OAuth redirect — tokens arrive as URL params.
   * Sets the access token in memory, stores the refresh token, then
   * fetches the full user profile from /auth/me to populate context.
   */
  const loginWithTokens = async (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Fetch the real user object so context is populated immediately
    const { data } = await api.get('/auth/me')
    const userData = data.data.user
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
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
    <AuthContext.Provider value={{ user, login, loginWithTokens, logout, loading, error }}>
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
