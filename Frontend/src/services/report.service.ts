/**
 * Report service — wraps GET /api/reports/monthly and GET /api/reports/monthly/export
 */
import api from '../utils/api'

export interface ReportSummary {
  totalRevenue: number
  totalExpenses: number
  grossProfit: number
  netProfit: number
  operatingExpenses: number
  purchaseCost: number
}

export interface ProductPerformanceRow {
  id: number
  name: string
  sku: string
  category: string
  unitsSold: number
  revenue: number
  cogs: number
  grossProfit: number
  marginPct: number
}

export interface ExpenseBreakdownRow {
  category: string
  amount: number
}

export interface ProfitTrendItem {
  label: string
  revenue: number
  expenses: number
  profit: number
}

export interface MonthlyReport {
  period: { label: string }
  summary: ReportSummary
  revenueVsExpenses: { revenue: number; expenses: number }
  profitTrend: ProfitTrendItem[]
  productPerformance: ProductPerformanceRow[]
  topSelling: ProductPerformanceRow[]
  expenseBreakdown: ExpenseBreakdownRow[]
}

/** Fetch the monthly report data for a given month/year */
export async function fetchMonthlyReport(params: {
  month: number
  year: number
  from?: string
  to?: string
}): Promise<MonthlyReport> {
  const { data } = await api.get('/reports/monthly', { params })
  return data.data.report
}

/**
 * Trigger the backend Excel export.
 * The backend streams the file — we create a blob URL and click-download it.
 */
export async function downloadMonthlyReportExcel(params: {
  month: number
  year: number
  from?: string
  to?: string
}): Promise<void> {
  const response = await api.get('/reports/monthly/export', {
    params,
    responseType: 'blob',
  })

  // Extract filename from Content-Disposition header if available
  const disposition = response.headers['content-disposition'] as string | undefined
  let filename = 'ZubaHouse_Report.xlsx'
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
