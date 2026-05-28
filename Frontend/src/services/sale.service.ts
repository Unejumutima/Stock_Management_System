/**
 * Sale service — wraps all calls to /api/sales
 * The backend returns sales with fields: id, productId, productName, sku, category,
 * quantity, sellingPrice, totalRevenue, saleDate
 */
import api from '../utils/api'

export interface Sale {
  id: number
  productId: number
  productName: string
  sku: string
  category: string
  quantity: number
  sellingPrice: number
  totalRevenue: number
  saleDate: string
}

export interface SaleSummary {
  totalSales: number
  totalUnits: number
  totalRevenue: number
  totalCost: number
  grossProfit: number
}

export interface CreateSalePayload {
  productId: number
  quantity: number
  saleDate: string
}

/** Fetch all sales, optionally filtered */
export async function fetchSales(params?: {
  productId?: number
  category?: string
  from?: string
  to?: string
  search?: string
}): Promise<Sale[]> {
  const { data } = await api.get('/sales', { params })
  return data.data.sales
}

/** Fetch sales summary (totals) */
export async function fetchSaleSummary(params?: { from?: string; to?: string }): Promise<SaleSummary> {
  const { data } = await api.get('/sales/summary', { params })
  return data.data.summary
}

/** Create a new sale — backend uses the product's selling price from the catalog */
export async function createSale(payload: CreateSalePayload): Promise<Sale> {
  const { data } = await api.post('/sales', payload)
  return data.data.sale
}

/** Delete a sale by id */
export async function deleteSale(id: number): Promise<void> {
  await api.delete(`/sales/${id}`)
}
