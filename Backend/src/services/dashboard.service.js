import * as dashboardModel from '../models/dashboard.model.js'

export async function getDashboard(query) {
  const kpis = await dashboardModel.getKpis({ from: query.from, to: query.to })
  const monthlyOverview = await dashboardModel.getMonthlyOverview(
    query.months ? Number(query.months) : 6,
  )
  const topProducts = await dashboardModel.getTopProducts(5, { from: query.from, to: query.to })

  return {
    kpis: {
      totalStock: kpis.totalStock,
      totalRevenue: kpis.totalRevenue,
      grossProfit: kpis.grossProfit,
      totalExpenses: kpis.totalExpenses,
      netProfit: kpis.netProfit,
    },
    monthlyOverview: monthlyOverview.map((row) => ({
      label: row.label,
      monthStart: row.month_start,
      revenue: Number(row.revenue),
      expenses: Number(row.expenses),
      netProfit: Number(row.net_profit),
    })),
    topProducts: topProducts.map((row) => ({
      id: row.id,
      name: row.name,
      sku: row.sku,
      unitsSold: Number(row.units_sold),
      revenue: Number(row.revenue),
    })),
  }
}
