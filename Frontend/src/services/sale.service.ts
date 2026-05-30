/**
 * Sale service — wraps all calls to /api/sales
 * productId is a UUID string (PostgreSQL UUID primary key).
 */
import api from '../utils/api'

export interface Sale {
  id: string
  productId: string
  productName: string
  sku: string
  category: string
  quantity: number
  sellingPrice: number
  totalRevenue: number
  saleDate: string | Date
}

export interface SaleSummary {
  totalSales: number
  totalUnits: number
  totalRevenue: number
  totalCost: number
  grossProfit: number
}

export interface CreateSalePayload {
  productId: string   // UUID
  quantity: number
  saleDate: string
}

export async function fetchSales(params?: {
  productId?: string
  category?: string
  from?: string
  to?: string
  search?: string
}): Promise<Sale[]> {
  const { data } = await api.get('/sales', { params })
  return data.data.sales
}

export async function fetchSaleSummary(params?: { from?: string; to?: string }): Promise<SaleSummary> {
  const { data } = await api.get('/sales/summary', { params })
  return data.data.summary
}

export async function createSale(payload: CreateSalePayload): Promise<Sale> {
  const { data } = await api.post('/sales', payload)
  return data.data.sale
}

export async function deleteSale(id: string): Promise<void> {
  await api.delete(`/sales/${id}`)
}
