import { pool } from '../config/db.js'
import { STOCK_SUBQUERY } from '../utils/stockSql.js'

export async function getKpis({ from, to } = {}) {
  const saleDateFilter = buildDateFilter('sa.sale_date', from, to)
  const expenseDateFilter = buildDateFilter('e.expense_date', from, to)

  const stockResult = await pool.query(
    `SELECT COALESCE(SUM((${STOCK_SUBQUERY})), 0)::int AS total_stock
     FROM products p`,
  )

  const salesResult = await pool.query(
    `SELECT
       COALESCE(SUM(sa.quantity * p.selling_price), 0) AS total_revenue,
       COALESCE(SUM(sa.quantity * p.purchase_price), 0) AS total_cogs,
       COALESCE(SUM(sa.quantity * (p.selling_price - p.purchase_price)), 0) AS gross_profit
     FROM sales sa
     JOIN products p ON p.id = sa.product_id
     ${saleDateFilter.clause}`,
    saleDateFilter.params,
  )

  const expenseResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total_expenses
     FROM expenses e
     ${expenseDateFilter.clause}`,
    expenseDateFilter.params,
  )

  const revenue = Number(salesResult.rows[0].total_revenue)
  const grossProfit = Number(salesResult.rows[0].gross_profit)
  const totalExpenses = Number(expenseResult.rows[0].total_expenses)

  return {
    totalStock: Number(stockResult.rows[0].total_stock),
    totalRevenue: revenue,
    grossProfit,
    totalExpenses,
    netProfit: grossProfit - totalExpenses,
  }
}

export async function getMonthlyOverview(months = 6) {
  const { rows } = await pool.query(
    `WITH months AS (
       SELECT generate_series(
         date_trunc('month', CURRENT_DATE) - ($1::int - 1) * INTERVAL '1 month',
         date_trunc('month', CURRENT_DATE),
         '1 month'::interval
       )::date AS month_start
     )
     SELECT
       to_char(m.month_start, 'Mon YY') AS label,
       m.month_start,
       COALESCE((
         SELECT SUM(sa.quantity * p.selling_price)
         FROM sales sa
         JOIN products p ON p.id = sa.product_id
         WHERE date_trunc('month', sa.sale_date) = m.month_start
       ), 0) AS revenue,
       COALESCE((
         SELECT SUM(e.amount)
         FROM expenses e
         WHERE date_trunc('month', e.expense_date) = m.month_start
       ), 0) AS expenses,
       COALESCE((
         SELECT SUM(sa.quantity * (p.selling_price - p.purchase_price))
         FROM sales sa
         JOIN products p ON p.id = sa.product_id
         WHERE date_trunc('month', sa.sale_date) = m.month_start
       ), 0) - COALESCE((
         SELECT SUM(e.amount)
         FROM expenses e
         WHERE date_trunc('month', e.expense_date) = m.month_start
       ), 0) AS net_profit
     FROM months m
     ORDER BY m.month_start ASC`,
    [months],
  )
  return rows
}

export async function getTopProducts(limit = 5, { from, to } = {}) {
  const filter = buildDateFilter('sa.sale_date', from, to)
  const { rows } = await pool.query(
    `SELECT
       p.id, p.name, p.sku,
       SUM(sa.quantity)::int AS units_sold,
       SUM(sa.quantity * p.selling_price) AS revenue
     FROM sales sa
     JOIN products p ON p.id = sa.product_id
     ${filter.clause}
     GROUP BY p.id, p.name, p.sku
     ORDER BY units_sold DESC
     LIMIT $${filter.params.length + 1}`,
    [...filter.params, limit],
  )
  return rows
}

function buildDateFilter(column, from, to) {
  const conditions = []
  const params = []
  let i = 1
  if (from) {
    conditions.push(`${column} >= $${i++}`)
    params.push(from)
  }
  if (to) {
    conditions.push(`${column} <= $${i++}`)
    params.push(to)
  }
  return {
    clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  }
}
