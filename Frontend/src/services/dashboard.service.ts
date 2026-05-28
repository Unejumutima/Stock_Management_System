/**
 * Dashboard service — wraps GET /api/dashboard
 * Returns KPIs, monthly overview (6 months), and top 5 products.
 */
import api from '../utils/api'

export interface DashboardKpis {
  totalStock: number
  totalRevenue: number
  grossProfit: number
  totalExpenses: number
  netProfit: number
}

export interface MonthlyOverviewItem {
  label: string
  monthStart: string
  revenue: number
  expenses: number
  netProfit: number
}

export interface TopProduct {
  id: number
  name: string
  sku: string
  unitsSold: number
  revenue: number
}

export interface DashboardData {
  kpis: DashboardKpis
  monthlyOverview: MonthlyOverviewItem[]
  topProducts: TopProduct[]
}

export async function fetchDashboard(params?: { from?: string; to?: string; months?: number }): Promise<DashboardData> {
  const { data } = await api.get('/dashboard', { params })
  return data.data
}
