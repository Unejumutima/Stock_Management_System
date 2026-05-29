import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'
import Products from './components/Products'
import Purchases from './components/Purchases'
import Sales from './components/Sales'
import Reports from './components/Reports'
import Expenses from './components/Expenses'
import UserManagement from './components/UserManagement'
import Login from './components/login'
import type { ReactNode } from 'react'

/**
 * Requires authentication. Shows nothing while session is being restored
 * to avoid a flash redirect to /login.
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

/**
 * Requires admin role. Redirects non-admins to the dashboard.
 */
function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        {/*
          Google OAuth callback — the backend redirects here with
          ?accessToken=...&refreshToken=... after a successful Google login.
          Login.tsx reads those params and calls loginWithTokens().
        */}
        <Route path="/auth/callback" element={<Login />} />

        {/* Protected routes — any authenticated user */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
        <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />

        {/* Admin-only route */}
        <Route path="/users" element={<AdminRoute><UserManagement /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
