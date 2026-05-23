import ExcelJS from 'exceljs'
import * as reportModel from '../models/report.model.js'

export async function getMonthlyReport(query) {
  const period = reportModel.resolvePeriod(query)
  const summary = await reportModel.getMonthlySummary(period)
  const productPerformance = await reportModel.getProductProfitability(period)
  const expenseBreakdown = await reportModel.getExpenseBreakdown(period)
  const profitTrend = await reportModel.getProfitTrend(6)

  const topSelling = [...productPerformance]
    .sort((a, b) => Number(b.units_sold) - Number(a.units_sold))
    .slice(0, 5)
    .map(mapProductRow)

  return {
    period,
    summary: {
      totalRevenue: summary.revenue,
      totalExpenses: summary.totalExpenses,
      grossProfit: summary.grossProfit,
      netProfit: summary.netProfit,
      operatingExpenses: summary.operatingExpenses,
      purchaseCost: summary.purchaseCost,
    },
    revenueVsExpenses: {
      revenue: summary.revenue,
      expenses: summary.totalExpenses,
    },
    profitTrend,
    productPerformance: productPerformance.map(mapProductRow),
    topSelling,
    expenseBreakdown: expenseBreakdown.map((r) => ({
      category: r.category,
      amount: Number(r.amount),
    })),
  }
}

function mapProductRow(row) {
  const revenue = Number(row.revenue)
  const grossProfit = Number(row.gross_profit)
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    category: row.category,
    unitsSold: Number(row.units_sold),
    revenue,
    cogs: Number(row.cogs),
    grossProfit,
    marginPct: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
  }
}

/**
 * Builds an Excel workbook buffer for download (used by Reports page export).
 */
export async function buildMonthlyReportExcel(query) {
  const report = await getMonthlyReport(query)
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Zuba House Stock Management'

  const summarySheet = workbook.addWorksheet('Summary')
  summarySheet.addRow(['Zuba House — Monthly Financial Report'])
  summarySheet.addRow(['Period', report.period.label])
  summarySheet.addRow([])
  summarySheet.addRow(['Metric', 'Amount (USD)'])
  summarySheet.addRow(['Total Revenue', report.summary.totalRevenue])
  summarySheet.addRow(['Total Expenses', report.summary.totalExpenses])
  summarySheet.addRow(['Gross Profit', report.summary.grossProfit])
  summarySheet.addRow(['Net Profit', report.summary.netProfit])

  const perfSheet = workbook.addWorksheet('Product Performance')
  perfSheet.addRow(['Product', 'SKU', 'Category', 'Units', 'Revenue', 'COGS', 'Gross Profit', 'Margin %'])
  report.productPerformance.forEach((p) => {
    perfSheet.addRow([p.name, p.sku, p.category, p.unitsSold, p.revenue, p.cogs, p.grossProfit, p.marginPct.toFixed(1)])
  })

  const expSheet = workbook.addWorksheet('Expenses')
  expSheet.addRow(['Category', 'Amount'])
  report.expenseBreakdown.forEach((e) => expSheet.addRow([e.category, e.amount]))

  const trendSheet = workbook.addWorksheet('Trend')
  trendSheet.addRow(['Month', 'Revenue', 'Expenses', 'Net Profit'])
  report.profitTrend.forEach((t) => trendSheet.addRow([t.label, t.revenue, t.expenses, t.profit]))

  const buffer = await workbook.xlsx.writeBuffer()
  return { buffer, filename: `ZubaHouse_Report_${report.period.label.replace(/\s+/g, '_')}.xlsx` }
}
