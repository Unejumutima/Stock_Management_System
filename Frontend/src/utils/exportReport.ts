import * as XLSX from 'xlsx'
import { formatCurrency } from '../constants/products'
import type { ReportSnapshot } from '../constants/reports'

export function exportMonthlyReportXlsx(report: ReportSnapshot, filename?: string) {
  const wb = XLSX.utils.book_new()

  const summaryRows = [
    ['Zuba House Stock Management System — Monthly Financial Report'],
    ['Period', report.periodLabel],
    ['Generated', new Date().toLocaleString()],
    [],
    ['Metric', 'Amount (USD)'],
    ['Total Revenue', report.totalRevenue],
    ['Total Expenses', report.totalExpenses],
    ['  — Inventory purchases (COGS)', report.purchaseCosts],
    ['  — Operating expenses', report.operatingExpenses],
    ['Gross Profit (product level)', report.totalProfit],
    ['Net Profit', report.netProfit],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), 'Summary')

  const perfHeader = ['Product', 'SKU', 'Category', 'Units Sold', 'Revenue', 'COGS', 'Gross Profit', 'Margin %']
  const perfRows = report.productPerformance.map((r) => [
    r.name,
    r.sku,
    r.category,
    r.unitsSold,
    r.revenue,
    r.cogs,
    r.grossProfit,
    Number(r.marginPct.toFixed(1)),
  ])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([perfHeader, ...perfRows]), 'Product Performance')

  const topHeader = ['Rank', 'Product', 'SKU', 'Units Sold', 'Revenue']
  const topRows = report.topSelling.map((r, i) => [i + 1, r.name, r.sku, r.unitsSold, r.revenue])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([topHeader, ...topRows]), 'Top Selling')

  const expHeader = ['Category', 'Amount (USD)', 'Share %']
  const expRows = report.expenseBreakdown.map((r) => [r.category, r.amount, Number(r.sharePct.toFixed(1))])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([expHeader, ...expRows]), 'Expense Breakdown')

  const profitHeader = ['Product', 'SKU', 'Revenue', 'COGS', 'Gross Profit', 'Margin %']
  const profitRows = report.profitByProduct.map((r) => [
    r.name,
    r.sku,
    r.revenue,
    r.cogs,
    r.grossProfit,
    Number(r.marginPct.toFixed(1)),
  ])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([profitHeader, ...profitRows]), 'Profit by Product')

  const trendHeader = ['Month', 'Revenue', 'Expenses', 'Net Profit']
  const trendRows = report.profitTrend.map((p) => [p.label, p.revenue, p.expenses, p.profit])
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([trendHeader, ...trendRows]), 'Monthly Trend')

  const safeName = report.periodLabel.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')
  XLSX.writeFile(wb, filename ?? `ZubaHouse_Report_${safeName}.xlsx`)
}

export function formatReportCurrency(value: number): string {
  return formatCurrency(value)
}
