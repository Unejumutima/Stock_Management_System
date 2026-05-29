import ExcelJS from 'exceljs'
import * as reportModel from '../models/report.model.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BRAND = '#0B2735'
const BRAND_LIGHT = 'D6E4EC'
const ACCENT = '10B981'
const WARN = 'F59E0B'
const DANGER = 'EF4444'

function usd(n) {
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function pct(n) {
  return `${Number(n).toFixed(1)}%`
}

function fmtDate(d) {
  if (!d) return ''
  const dt = d instanceof Date ? d : new Date(d)
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Apply header row styling */
function styleHeader(row, bgHex = BRAND) {
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${bgHex}` } }
    cell.font = { bold: true, color: { argb: bgHex === BRAND ? 'FFFFFFFF' : 'FF0B2735' }, size: 10 }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    }
  })
  row.height = 22
}

/** Apply alternating row fill */
function styleDataRow(row, idx) {
  const bg = idx % 2 === 0 ? 'FFF8FAFC' : 'FFFFFFFF'
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
    cell.font = { size: 10 }
    cell.alignment = { vertical: 'middle' }
  })
  row.height = 18
}

/** Add a section title row */
function addSectionTitle(ws, title, colSpan) {
  ws.addRow([])
  const row = ws.addRow([title])
  row.getCell(1).font = { bold: true, size: 11, color: { argb: `FF${BRAND}` } }
  row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BRAND_LIGHT}` } }
  if (colSpan > 1) ws.mergeCells(row.number, 1, row.number, colSpan)
  row.height = 20
  return row
}

/** Set column widths */
function setCols(ws, widths) {
  ws.columns = widths.map((w) => ({ width: w }))
}

// ─── Data assembly ────────────────────────────────────────────────────────────

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

export async function getMonthlyReport(query) {
  const period = reportModel.resolvePeriod(query)

  const [
    summary,
    productPerformance,
    expenseBreakdown,
    profitTrend,
    salesDetail,
    purchasesDetail,
    expensesDetail,
    inventorySnapshot,
    userActivity,
  ] = await Promise.all([
    reportModel.getMonthlySummary(period),
    reportModel.getProductProfitability(period),
    reportModel.getExpenseBreakdown(period),
    reportModel.getProfitTrend(6),
    reportModel.getSalesDetail(period),
    reportModel.getPurchasesDetail(period),
    reportModel.getExpensesDetail(period),
    reportModel.getInventorySnapshot(),
    reportModel.getUserActivity(period),
  ])

  const mappedProducts = productPerformance.map(mapProductRow)
  const topSelling = [...mappedProducts].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5)
  const leastSelling = mappedProducts.length > 0
    ? [...mappedProducts].sort((a, b) => a.unitsSold - b.unitsSold)[0]
    : null

  // Sales stats
  const totalSalesTransactions = salesDetail.length
  const totalUnitsSold = salesDetail.reduce((s, r) => s + Number(r.quantity), 0)
  const avgSaleValue = totalSalesTransactions > 0 ? summary.revenue / totalSalesTransactions : 0

  // Purchase stats
  const totalPurchaseTransactions = purchasesDetail.length
  const totalUnitsPurchased = purchasesDetail.reduce((s, r) => s + Number(r.quantity), 0)
  const mostPurchasedMap = new Map()
  for (const p of purchasesDetail) {
    mostPurchasedMap.set(p.product_name, (mostPurchasedMap.get(p.product_name) ?? 0) + Number(p.quantity))
  }
  const mostPurchasedProduct = [...mostPurchasedMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // Inventory stats
  const totalProducts = inventorySnapshot.length
  const totalInventoryValue = inventorySnapshot.reduce((s, r) => s + Number(r.inventory_value), 0)
  const lowStockItems = inventorySnapshot.filter((r) => r.status === 'Low Stock')
  const outOfStockItems = inventorySnapshot.filter((r) => r.status === 'Out of Stock')

  // Profitability
  const profitMarginPct = summary.revenue > 0 ? (summary.netProfit / summary.revenue) * 100 : 0

  return {
    period,
    generatedAt: new Date(),
    summary: {
      totalRevenue: summary.revenue,
      totalExpenses: summary.totalExpenses,
      grossProfit: summary.grossProfit,
      netProfit: summary.netProfit,
      operatingExpenses: summary.operatingExpenses,
      purchaseCost: summary.purchaseCost,
      profitMarginPct,
    },
    salesStats: {
      totalRevenue: summary.revenue,
      totalUnitsSold,
      totalTransactions: totalSalesTransactions,
      avgSaleValue,
      bestSellingProduct: topSelling[0]?.name ?? '—',
      leastSellingProduct: leastSelling?.name ?? '—',
    },
    purchaseStats: {
      totalCost: summary.purchaseCost,
      totalTransactions: totalPurchaseTransactions,
      totalUnitsPurchased,
      mostPurchasedProduct,
    },
    expenseStats: {
      totalExpenses: summary.operatingExpenses,
      highestCategory: expenseBreakdown[0]?.category ?? '—',
      highestCategoryAmount: Number(expenseBreakdown[0]?.amount ?? 0),
    },
    inventoryStats: {
      totalProducts,
      totalInventoryValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
    },
    revenueVsExpenses: { revenue: summary.revenue, expenses: summary.totalExpenses },
    profitTrend,
    productPerformance: mappedProducts,
    topSelling,
    leastSelling,
    expenseBreakdown: expenseBreakdown.map((r) => ({ category: r.category, amount: Number(r.amount) })),
    salesDetail,
    purchasesDetail,
    expensesDetail,
    inventorySnapshot,
    lowStockItems,
    outOfStockItems,
    userActivity,
  }
}

// ─── Excel builder ────────────────────────────────────────────────────────────

export async function buildMonthlyReportExcel(query) {
  const report = await getMonthlyReport(query)
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Zuba House Stock Management'
  wb.created = report.generatedAt

  // ── Sheet 1: Cover / Summary ──────────────────────────────────────────────
  const cover = wb.addWorksheet('Summary')
  setCols(cover, [30, 25, 25, 25])

  // Title block
  cover.mergeCells('A1:D1')
  const titleCell = cover.getCell('A1')
  titleCell.value = 'ZUBA HOUSE STOCK MANAGEMENT'
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } }
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BRAND}` } }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  cover.getRow(1).height = 36

  cover.mergeCells('A2:D2')
  const subTitle = cover.getCell('A2')
  subTitle.value = 'Monthly Financial Report'
  subTitle.font = { bold: true, size: 13, color: { argb: `FF${BRAND}` } }
  subTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BRAND_LIGHT}` } }
  subTitle.alignment = { horizontal: 'center', vertical: 'middle' }
  cover.getRow(2).height = 26

  cover.addRow([])

  // Report metadata
  const meta = [
    ['Business Name', 'Zuba House'],
    ['Report Period', report.period.label],
    ['Generated Date', fmtDate(report.generatedAt)],
    ['Report Type', 'Monthly Financial Report'],
  ]
  for (const [label, value] of meta) {
    const row = cover.addRow([label, value])
    row.getCell(1).font = { bold: true, size: 10, color: { argb: `FF${BRAND}` } }
    row.getCell(2).font = { size: 10 }
    row.height = 18
  }

  // ── Profitability Summary ─────────────────────────────────────────────────
  addSectionTitle(cover, 'PROFITABILITY SUMMARY', 4)
  const profitHeaders = cover.addRow(['Metric', 'Amount', '', ''])
  styleHeader(profitHeaders, BRAND_LIGHT)

  const profitRows = [
    ['Gross Revenue', usd(report.summary.totalRevenue)],
    ['Purchase Costs (COGS)', usd(report.summary.purchaseCost)],
    ['Operating Expenses', usd(report.summary.operatingExpenses)],
    ['Total Expenses', usd(report.summary.totalExpenses)],
    ['Gross Profit', usd(report.summary.grossProfit)],
    ['Net Profit', usd(report.summary.netProfit)],
    ['Profit Margin', pct(report.summary.profitMarginPct)],
  ]
  profitRows.forEach(([label, value], i) => {
    const row = cover.addRow([label, value])
    styleDataRow(row, i)
    if (label === 'Net Profit') {
      row.getCell(2).font = {
        bold: true, size: 10,
        color: { argb: report.summary.netProfit >= 0 ? `FF${ACCENT}` : `FF${DANGER}` },
      }
    }
  })

  // ── Sales Summary ─────────────────────────────────────────────────────────
  addSectionTitle(cover, 'SALES SUMMARY', 4)
  const salesHeaders = cover.addRow(['Metric', 'Value', '', ''])
  styleHeader(salesHeaders, BRAND_LIGHT)
  const salesRows = [
    ['Total Sales Revenue', usd(report.salesStats.totalRevenue)],
    ['Total Items Sold', report.salesStats.totalUnitsSold.toLocaleString()],
    ['Number of Transactions', report.salesStats.totalTransactions.toString()],
    ['Average Sale Value', usd(report.salesStats.avgSaleValue)],
    ['Best Selling Product', report.salesStats.bestSellingProduct],
    ['Least Selling Product', report.salesStats.leastSellingProduct],
  ]
  salesRows.forEach(([label, value], i) => {
    const row = cover.addRow([label, value])
    styleDataRow(row, i)
  })

  // ── Purchase Summary ──────────────────────────────────────────────────────
  addSectionTitle(cover, 'PURCHASE SUMMARY', 4)
  const purchHeaders = cover.addRow(['Metric', 'Value', '', ''])
  styleHeader(purchHeaders, BRAND_LIGHT)
  const purchRows = [
    ['Total Purchase Cost', usd(report.purchaseStats.totalCost)],
    ['Number of Transactions', report.purchaseStats.totalTransactions.toString()],
    ['Total Units Purchased', report.purchaseStats.totalUnitsPurchased.toLocaleString()],
    ['Most Purchased Product', report.purchaseStats.mostPurchasedProduct],
  ]
  purchRows.forEach(([label, value], i) => {
    const row = cover.addRow([label, value])
    styleDataRow(row, i)
  })

  // ── Expense Summary ───────────────────────────────────────────────────────
  addSectionTitle(cover, 'EXPENSE SUMMARY', 4)
  const expHeaders = cover.addRow(['Metric', 'Value', '', ''])
  styleHeader(expHeaders, BRAND_LIGHT)
  const expRows = [
    ['Total Expenses', usd(report.expenseStats.totalExpenses)],
    ['Highest Expense Category', report.expenseStats.highestCategory],
    ['Highest Category Amount', usd(report.expenseStats.highestCategoryAmount)],
  ]
  expRows.forEach(([label, value], i) => {
    const row = cover.addRow([label, value])
    styleDataRow(row, i)
  })

  // ── Inventory Summary ─────────────────────────────────────────────────────
  addSectionTitle(cover, 'INVENTORY SUMMARY', 4)
  const invHeaders = cover.addRow(['Metric', 'Value', '', ''])
  styleHeader(invHeaders, BRAND_LIGHT)
  const invRows = [
    ['Total Products', report.inventoryStats.totalProducts.toString()],
    ['Current Inventory Value', usd(report.inventoryStats.totalInventoryValue)],
    ['Low Stock Products', report.inventoryStats.lowStockCount.toString()],
    ['Out of Stock Products', report.inventoryStats.outOfStockCount.toString()],
  ]
  invRows.forEach(([label, value], i) => {
    const row = cover.addRow([label, value])
    styleDataRow(row, i)
    if (label === 'Out of Stock Products' && report.inventoryStats.outOfStockCount > 0) {
      row.getCell(2).font = { bold: true, color: { argb: `FF${DANGER}` }, size: 10 }
    }
    if (label === 'Low Stock Products' && report.inventoryStats.lowStockCount > 0) {
      row.getCell(2).font = { bold: true, color: { argb: `FF${WARN}` }, size: 10 }
    }
  })

  // ── Sheet 2: Sales Detail ─────────────────────────────────────────────────
  const salesWs = wb.addWorksheet('Sales Detail')
  setCols(salesWs, [32, 14, 16, 14, 16, 16, 14])
  const salesHdr = salesWs.addRow(['Product', 'SKU', 'Category', 'Qty', 'Unit Price', 'Total Revenue', 'Date'])
  styleHeader(salesHdr)
  report.salesDetail.forEach((r, i) => {
    const row = salesWs.addRow([
      r.product_name, r.sku, r.category,
      Number(r.quantity), usd(r.selling_price), usd(r.total_revenue), fmtDate(r.sale_date),
    ])
    styleDataRow(row, i)
    row.getCell(6).font = { bold: true, color: { argb: `FF${ACCENT}` }, size: 10 }
  })
  if (report.salesDetail.length === 0) salesWs.addRow(['No sales recorded for this period.'])

  // ── Sheet 3: Top 5 Products ───────────────────────────────────────────────
  const top5Ws = wb.addWorksheet('Top 5 Products')
  setCols(top5Ws, [4, 32, 14, 16, 14, 16, 16, 14])
  const top5Hdr = top5Ws.addRow(['#', 'Product', 'SKU', 'Category', 'Units Sold', 'Revenue', 'Gross Profit', 'Margin %'])
  styleHeader(top5Hdr)
  report.topSelling.forEach((r, i) => {
    const row = top5Ws.addRow([
      i + 1, r.name, r.sku, r.category,
      r.unitsSold, usd(r.revenue), usd(r.grossProfit), pct(r.marginPct),
    ])
    styleDataRow(row, i)
  })
  if (report.topSelling.length === 0) top5Ws.addRow(['', 'No sales data for this period.'])

  // ── Sheet 4: Product Performance ─────────────────────────────────────────
  const perfWs = wb.addWorksheet('Product Performance')
  setCols(perfWs, [32, 14, 16, 14, 16, 16, 16, 14])
  const perfHdr = perfWs.addRow(['Product', 'SKU', 'Category', 'Units Sold', 'Revenue', 'COGS', 'Gross Profit', 'Margin %'])
  styleHeader(perfHdr)
  report.productPerformance.forEach((r, i) => {
    const row = perfWs.addRow([
      r.name, r.sku, r.category, r.unitsSold,
      usd(r.revenue), usd(r.cogs), usd(r.grossProfit), pct(r.marginPct),
    ])
    styleDataRow(row, i)
  })
  if (report.productPerformance.length === 0) perfWs.addRow(['No product sales data for this period.'])

  // ── Sheet 5: Purchases Detail ─────────────────────────────────────────────
  const purchWs = wb.addWorksheet('Purchases Detail')
  setCols(purchWs, [32, 14, 16, 14, 16, 16, 14])
  const purchHdr = purchWs.addRow(['Product', 'SKU', 'Category', 'Qty', 'Price/Unit', 'Total Cost', 'Date'])
  styleHeader(purchHdr)
  report.purchasesDetail.forEach((r, i) => {
    const row = purchWs.addRow([
      r.product_name, r.sku, r.category,
      Number(r.quantity), usd(r.price_per_unit), usd(r.total_cost), fmtDate(r.purchase_date),
    ])
    styleDataRow(row, i)
  })
  if (report.purchasesDetail.length === 0) purchWs.addRow(['No purchases recorded for this period.'])

  // ── Sheet 6: Expenses Detail ──────────────────────────────────────────────
  const expWs = wb.addWorksheet('Expenses Detail')
  setCols(expWs, [24, 18, 14, 40])
  const expHdr = expWs.addRow(['Category', 'Amount', 'Date', 'Notes'])
  styleHeader(expHdr)
  report.expensesDetail.forEach((r, i) => {
    const row = expWs.addRow([r.category, usd(r.amount), fmtDate(r.expense_date), r.notes ?? ''])
    styleDataRow(row, i)
  })
  if (report.expensesDetail.length === 0) expWs.addRow(['No expenses recorded for this period.'])

  // Expense breakdown sub-table
  expWs.addRow([])
  addSectionTitle(expWs, 'EXPENSE BREAKDOWN BY CATEGORY', 4)
  const expBrkHdr = expWs.addRow(['Category', 'Total Amount', '', ''])
  styleHeader(expBrkHdr, BRAND_LIGHT)
  report.expenseBreakdown.forEach((r, i) => {
    const row = expWs.addRow([r.category, usd(r.amount)])
    styleDataRow(row, i)
  })

  // ── Sheet 7: Inventory Snapshot ───────────────────────────────────────────
  const invWs = wb.addWorksheet('Inventory')
  setCols(invWs, [32, 14, 16, 14, 16, 16, 16, 14])
  const invHdr = invWs.addRow(['Product', 'SKU', 'Category', 'Stock', 'Purchase Price', 'Selling Price', 'Inventory Value', 'Status'])
  styleHeader(invHdr)
  report.inventorySnapshot.forEach((r, i) => {
    const stock = Number(r.stock)
    const row = invWs.addRow([
      r.name, r.sku, r.category, stock,
      usd(r.purchase_price), usd(r.selling_price), usd(r.inventory_value), r.status,
    ])
    styleDataRow(row, i)
    const statusCell = row.getCell(8)
    if (r.status === 'Out of Stock') {
      statusCell.font = { bold: true, color: { argb: `FF${DANGER}` }, size: 10 }
    } else if (r.status === 'Low Stock') {
      statusCell.font = { bold: true, color: { argb: `FF${WARN}` }, size: 10 }
    } else {
      statusCell.font = { bold: true, color: { argb: `FF${ACCENT}` }, size: 10 }
    }
  })

  // Low stock sub-table
  if (report.lowStockItems.length > 0) {
    invWs.addRow([])
    addSectionTitle(invWs, 'LOW STOCK ALERT', 8)
    const lsHdr = invWs.addRow(['Product', 'SKU', 'Category', 'Stock', '', '', '', ''])
    styleHeader(lsHdr, WARN)
    report.lowStockItems.forEach((r, i) => {
      const row = invWs.addRow([r.name, r.sku, r.category, Number(r.stock)])
      styleDataRow(row, i)
    })
  }

  // Out of stock sub-table
  if (report.outOfStockItems.length > 0) {
    invWs.addRow([])
    addSectionTitle(invWs, 'OUT OF STOCK', 8)
    const osHdr = invWs.addRow(['Product', 'SKU', 'Category', '', '', '', '', ''])
    styleHeader(osHdr, DANGER)
    report.outOfStockItems.forEach((r, i) => {
      const row = invWs.addRow([r.name, r.sku, r.category])
      styleDataRow(row, i)
    })
  }

  // ── Sheet 8: User Activity ────────────────────────────────────────────────
  const userWs = wb.addWorksheet('User Activity')
  setCols(userWs, [30, 20, 14, 20, 20])

  addSectionTitle(userWs, 'LOGIN ACTIVITY', 5)
  const loginHdr = userWs.addRow(['User', 'Email', 'Role', 'Login Count', 'Last Login'])
  styleHeader(loginHdr)
  if (report.userActivity.loginActivity.length === 0) {
    userWs.addRow(['No login activity recorded for this period.'])
  } else {
    report.userActivity.loginActivity.forEach((r, i) => {
      const row = userWs.addRow([
        r.full_name, r.email, r.role,
        r.login_count, fmtDate(r.last_login),
      ])
      styleDataRow(row, i)
    })
  }

  addSectionTitle(userWs, 'NEW USERS ADDED THIS PERIOD', 5)
  const newUserHdr = userWs.addRow(['Name', 'Email', 'Role', 'Registered Date', ''])
  styleHeader(newUserHdr)
  if (report.userActivity.newUsers.length === 0) {
    userWs.addRow(['No new users registered in this period.'])
  } else {
    report.userActivity.newUsers.forEach((r, i) => {
      const row = userWs.addRow([r.full_name, r.email, r.role, fmtDate(r.created_at)])
      styleDataRow(row, i)
    })
  }

  // ── Sheet 9: 6-Month Trend ────────────────────────────────────────────────
  const trendWs = wb.addWorksheet('6-Month Trend')
  setCols(trendWs, [16, 20, 20, 20])
  const trendHdr = trendWs.addRow(['Month', 'Revenue', 'Expenses', 'Net Profit'])
  styleHeader(trendHdr)
  report.profitTrend.forEach((t, i) => {
    const row = trendWs.addRow([t.label, usd(t.revenue), usd(t.expenses), usd(t.profit)])
    styleDataRow(row, i)
    const profitCell = row.getCell(4)
    profitCell.font = {
      bold: true, size: 10,
      color: { argb: t.profit >= 0 ? `FF${ACCENT}` : `FF${DANGER}` },
    }
  })

  // ── Build and return ──────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer()
  const safePeriod = report.period.label.replace(/[^a-zA-Z0-9_-]/g, '_')
  return { buffer, filename: `ZubaHouse_Report_${safePeriod}.xlsx` }
}
