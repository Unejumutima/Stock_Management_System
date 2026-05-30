/**
 * Purchase service — wraps all calls to /api/purchases
 * productId is a UUID string (PostgreSQL UUID primary key).
 */
import api from '../utils/api'

export interface Purchase {
  id: string
  productId: string
  productName: string
  sku: string
  category: string
  quantity: number
  pricePerUnit: number
  totalCost: number
  purchaseDate: string | Date
}

export interface PurchaseSummary {
  totalPurchases: number
  totalUnits: number
  totalCost: number
}

export interface CreatePurchasePayload {
  productId: string   // UUID
  quantity: number
  pricePerUnit: number
  purchaseDate: string
}

export async function fetchPurchases(params?: {
  productId?: string
  category?: string
  from?: string
  to?: string
  search?: string
}): Promise<Purchase[]> {
  const { data } = await api.get('/purchases', { params })
  return data.data.purchases
}

export async function fetchPurchaseSummary(params?: { from?: string; to?: string }): Promise<PurchaseSummary> {
  const { data } = await api.get('/purchases/summary', { params })
  return data.data.summary
}

export async function createPurchase(payload: CreatePurchasePayload): Promise<Purchase> {
  const { data } = await api.post('/purchases', payload)
  return data.data.purchase
}

export async function deletePurchase(id: string): Promise<void> {
  await api.delete(`/purchases/${id}`)
}
