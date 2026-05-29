import { INITIAL_EXPENSES, type Expense } from './expenses'
import { INITIAL_PRODUCTS } from './products'
import { INITIAL_PURCHASES, purchaseTotalCost, type Purchase } from './purchases'
import { INITIAL_SALES, saleTotalRevenue, type Sale } from './sales'
import { parseISODate } from './transactions'

export const REPORT_MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const

/** Dynamically generates years from 2024 to the current year + 1 */
function buildReportYears(): string[] {
  const current = new Date().getFullYear()
  const years: string[] = []
  for (let y = 2024; y <= current + 1; y++) {
    years.push(String(y))
  }
  return years
}

export const REPORT_YEARS: string[] = buildReportYears()

export type ReportPeriod = {
  month: number
  year: number
  customFrom?: string
  customTo?: string
}

export type ProductPerformanceRow = {
  productId: string
  name: string
  sku: string
  category: string
  unitsSold: number
  revenue: number
  cogs: number
  grossProfit: number
  marginPct: number
}

export type ExpenseBreakdownRow = {
  category: string
  amount: number
  sharePct: number
}

export type MonthlyTrendPoint = {
  label: string
  month: number
  year: number
  revenue: number
  expenses: number
  profit: number
}

export type ReportSnapshot = {
  periodLabel: string
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  netProfit: number
  purchaseCosts: number
  operatingExpenses: number
  revenueVsExpenses: { revenue: number; expenses: number }
  profitTrend: MonthlyTrendPoint[]
  productPerformance: ProductPerformanceRow[]
  topSelling: ProductPerformanceRow[]
  expenseBreakdown: ExpenseBreakdownRow[]
  profitByProduct: ProductPerformanceRow[]
}

function inPeriod(dateStr: string, period: ReportPeriod): boolean {
  const d = parseISODate(dateStr)
  if (period.customFrom && period.customTo) {
    const from = parseISODate(period.customFrom)
    const to = parseISODate(period.customTo)
    to.setHours(23, 59, 59, 999)
    return d >= from && d <= to
  }
  return d.getMonth() + 1 === period.month && d.getFullYear() === period.year
}

function filterSales(period: ReportPeriod): Sale[] {
  return INITIAL_SALES.filter((s) => inPeriod(s.saleDate, period))
}

function filterPurchases(period: ReportPeriod): Purchase[] {
  return INITIAL_PURCHASES.filter((p) => inPeriod(p.purchaseDate, period))
}

function filterExpenses(period: ReportPeriod): Expense[] {
  return INITIAL_EXPENSES.filter((e) => inPeriod(e.date, period))
}

function productCogs(productId: string, units: number): number {
  const product = INITIAL_PRODUCTS.find((p) => p.id === productId)
  return product ? units * product.purchasePrice : 0
}

function buildProductRows(sales: Sale[]): ProductPerformanceRow[] {
  const map = new Map<string, ProductPerformanceRow>()

  for (const sale of sales) {
    const existing = map.get(sale.productId)
    const revenue = saleTotalRevenue(sale)
    const cogs = productCogs(sale.productId, sale.quantity)
    if (existing) {
      existing.unitsSold += sale.quantity
      existing.revenue += revenue
      existing.cogs += cogs
    } else {
      map.set(sale.productId, {
        productId: sale.productId,
        name: sale.productName,
        sku: sale.sku,
        category: sale.category,
        unitsSold: sale.quantity,
        revenue,
        cogs,
        grossProfit: 0,
        marginPct: 0,
      })
    }
  }

  return [...map.values()]
    .map((row) => {
      const grossProfit = row.revenue - row.cogs
      const marginPct = row.revenue > 0 ? (grossProfit / row.revenue) * 100 : 0
      return { ...row, grossProfit, marginPct }
    })
    .sort((a, b) => b.revenue - a.revenue)
}

function buildExpenseBreakdown(expenses: Expense[], purchaseCosts: number): ExpenseBreakdownRow[] {
  const byCategory = new Map<string, number>()
  for (const e of expenses) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount)
  }
  if (purchaseCosts > 0) {
    byCategory.set('Inventory purchases (COGS)', (byCategory.get('Inventory purchases (COGS)') ?? 0) + purchaseCosts)
  }
  const total = [...byCategory.values()].reduce((s, v) => s + v, 0)
  return [...byCategory.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      sharePct: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

function monthLabel(month: number, year: number): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(new Date(year, month - 1, 1))
}

function buildProfitTrend(anchor: ReportPeriod): MonthlyTrendPoint[] {
  const points: MonthlyTrendPoint[] = []
  let m = anchor.month
  let y = anchor.year

  for (let i = 5; i >= 0; i--) {
    let pm = m - i
    let py = y
    while (pm < 1) {
      pm += 12
      py -= 1
    }
    const period: ReportPeriod = { month: pm, year: py }
    const sales = filterSales(period)
    const purchases = filterPurchases(period)
    const expenses = filterExpenses(period)
    const revenue = sales.reduce((s, r) => s + saleTotalRevenue(r), 0)
    const purchaseCosts = purchases.reduce((s, r) => s + purchaseTotalCost(r), 0)
    const operating = expenses.reduce((s, e) => s + e.amount, 0)
    const totalExpenses = purchaseCosts + operating
    points.push({
      label: monthLabel(pm, py),
      month: pm,
      year: py,
      revenue,
      expenses: totalExpenses,
      profit: revenue - totalExpenses,
    })
  }
  return points
}

export function periodLabel(period: ReportPeriod): string {
  if (period.customFrom && period.customTo) {
    return `${period.customFrom} — ${period.customTo}`
  }
  const monthName = REPORT_MONTHS.find((m) => m.value === String(period.month))?.label ?? ''
  return `${monthName} ${period.year}`
}

export function buildReportSnapshot(period: ReportPeriod): ReportSnapshot {
  const sales = filterSales(period)
  const purchases = filterPurchases(period)
  const expenses = filterExpenses(period)

  const totalRevenue = sales.reduce((s, r) => s + saleTotalRevenue(r), 0)
  const purchaseCosts = purchases.reduce((s, r) => s + purchaseTotalCost(r), 0)
  const operatingExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const totalExpenses = purchaseCosts + operatingExpenses
  const productRows = buildProductRows(sales)
  const totalProfit = productRows.reduce((s, r) => s + r.grossProfit, 0)
  const netProfit = totalRevenue - totalExpenses

  return {
    periodLabel: periodLabel(period),
    totalRevenue,
    totalExpenses,
    totalProfit,
    netProfit,
    purchaseCosts,
    operatingExpenses,
    revenueVsExpenses: { revenue: totalRevenue, expenses: totalExpenses },
    profitTrend: buildProfitTrend(period),
    productPerformance: productRows,
    topSelling: [...productRows].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5),
    expenseBreakdown: buildExpenseBreakdown(expenses, purchaseCosts),
    profitByProduct: [...productRows].sort((a, b) => b.grossProfit - a.grossProfit),
  }
}

export function defaultReportPeriod(now = new Date()): ReportPeriod {
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}
