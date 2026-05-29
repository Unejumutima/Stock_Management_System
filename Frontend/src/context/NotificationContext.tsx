/**
 * NotificationContext — client-side notification system.
 *
 * Notifications are generated from real app events (login, product CRUD,
 * stock alerts, etc.) and stored in localStorage so they persist across
 * page refreshes. No new backend tables required.
 *
 * Each notification has:
 *   id        — unique string
 *   type      — 'info' | 'success' | 'warning' | 'error'
 *   category  — used to filter by role (see CATEGORY_ROLES below)
 *   title     — short heading
 *   message   — detail text
 *   read      — boolean
 *   createdAt — ISO timestamp
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export type NotificationCategory =
  | 'login_success'
  | 'login_failed'
  | 'product_added'
  | 'product_updated'
  | 'product_deleted'
  | 'low_stock'
  | 'out_of_stock'
  | 'new_user'
  | 'unauthorized_attempt'
  | 'report_ready'
  | 'action_error'

export interface Notification {
  id: string
  type: NotificationType
  category: NotificationCategory
  title: string
  message: string
  read: boolean
  createdAt: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  push: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const STORAGE_KEY = 'zuba_notifications'
const MAX_STORED = 50 // keep last 50 notifications

function load(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Notification[]) : []
  } catch {
    return []
  }
}

function save(items: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_STORED)))
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(load)

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    save(notifications)
  }, [notifications])

  const push = useCallback((n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const item: Notification = {
      ...n,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
    }
    setNotifications((prev) => [item, ...prev].slice(0, MAX_STORED))
  }, [])

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, push, markRead, markAllRead, remove, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
