/**
 * Inventory service — wraps all calls to /api/inventory
 * Backend returns inventory items with the same fields as products plus:
 * status: 'in_stock' | 'low_stock' | 'out_of_stock'
 * inventoryValue: number
 * totalPurchased / totalSold are also available
 */
import api from '../utils/api'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stock: number
  totalPurchased: number
  totalSold: number
  status: StockStatus
  inventoryValue: number
}

export interface InventoryOverview {
  productCount: number
  totalUnits: number
  totalInventoryValue: number
  outOfStockCount: number
  lowStockCount: number
}

/** Fetch full inventory list */
export async function fetchInventory(params?: {
  search?: string
  category?: string
  lowStockThreshold?: number
}): Promise<InventoryItem[]> {
  const { data } = await api.get('/inventory', { params })
  return data.data.items
}

/** Fetch inventory overview KPIs */
export async function fetchInventoryOverview(): Promise<InventoryOverview> {
  const { data } = await api.get('/inventory/overview')
  return data.data.overview
}

/** Fetch only low-stock items */
export async function fetchLowStock(threshold?: number): Promise<InventoryItem[]> {
  const { data } = await api.get('/inventory/low-stock', { params: threshold ? { threshold } : undefined })
  return data.data.items
}

/**
 * Trigger the backend inventory Excel export.
 * Creates a blob URL and click-downloads the file.
 */
export async function downloadInventoryExcel(): Promise<void> {
  const response = await api.get('/inventory/export', { responseType: 'blob' })

  const disposition = response.headers['content-disposition'] as string | undefined
  let filename = 'ZubaHouse_Inventory.xlsx'
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/)
    if (match?.[1]) filename = match[1]
  }

  const url = URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
