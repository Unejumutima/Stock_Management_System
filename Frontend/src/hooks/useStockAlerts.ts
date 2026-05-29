/**
 * useStockAlerts — polls the inventory overview every 5 minutes and
 * pushes low-stock / out-of-stock notifications for admin users.
 * Only runs when the current user is an admin.
 */
import { useEffect, useRef } from 'react'
import { fetchInventoryOverview } from '../services/inventory.service'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'

const POLL_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

export function useStockAlerts() {
  const { user } = useAuth()
  const { push } = useNotifications()
  // Track what we've already notified to avoid duplicates in the same session
  const notifiedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (user?.role !== 'admin') return

    async function check() {
      try {
        const overview = await fetchInventoryOverview()

        if (overview.outOfStockCount > 0) {
          const key = `out_of_stock_${overview.outOfStockCount}`
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key)
            push({
              type: 'error',
              category: 'out_of_stock',
              title: 'Out of stock alert',
              message: `${overview.outOfStockCount} product${overview.outOfStockCount > 1 ? 's are' : ' is'} completely out of stock.`,
            })
          }
        }

        if (overview.lowStockCount > 0) {
          const key = `low_stock_${overview.lowStockCount}`
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key)
            push({
              type: 'warning',
              category: 'low_stock',
              title: 'Low stock alert',
              message: `${overview.lowStockCount} product${overview.lowStockCount > 1 ? 's are' : ' is'} running low on stock.`,
            })
          }
        }
      } catch {
        // Silently ignore — don't spam errors for a background poll
      }
    }

    check() // run immediately on mount
    const interval = setInterval(check, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [user?.role, push])
}
