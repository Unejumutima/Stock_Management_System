/**
 * Purchase service — wraps all calls to /api/purchases
 * Backend returns: id, productId, productName, sku, category,
 * quantity, pricePerUnit, totalCost, purchaseDate
 */
import api from '../utils/api'

export interface Purchase {
  id: number
  productId: number
  productName: string
  sku: string
  category: string
  quantity: number
  pricePerUnit: number
  totalCost: number
  purchaseDate: string
}

export interface PurchaseSummary {
  totalPurchases: number
  totalUnits: number
  totalCost: number
}

export interface CreatePurchasePayload {
  productId: number
  quantity: number
  pricePerUnit: number
  purchaseDate: string
}

/** Fetch all purchases, optionally filtered */
export async function fetchPurchases(params?: {
  productId?: number
  category?: string
  from?: string
  to?: string
  search?: string
}): Promise<Purchase[]> {
  const { data } = await api.get('/purchases', { params })
  return data.data.purchases
}

/** Fetch purchase summary (totals) */
export async function fetchPurchaseSummary(params?: { from?: string; to?: string }): Promise<PurchaseSummary> {
  const { data } = await api.get('/purchases/summary', { params })
  return data.data.summary
}

/** Create a new purchase */
export async function createPurchase(payload: CreatePurchasePayload): Promise<Purchase> {
  const { data } = await api.post('/purchases', payload)
  return data.data.purchase
}

/** Delete a purchase by id */
export async function deletePurchase(id: number): Promise<void> {
  await api.delete(`/purchases/${id}`)
}
