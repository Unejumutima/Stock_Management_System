import { pool } from '../config/db.js'

/**
 * Report model — SQL for monthly financial summaries and product profitability.
 */

function monthRange(year, month) {
  const m = String(month).padStart(2, '0')
  const lastDay = new Date(year, month, 0).getDate()
  return {
    from: `${year}-${m}-01`,
    to: `${year}-${m}-${String(lastDay).padStart(2, '0')}`,
  }
}

export function resolvePeriod({ year, month, from, to }) {
  if (from && to) return { from, to, label: `${from} to ${to}` }
  const y = Number(year) || new Date().getFullYear()
  const m = Number(month) || new Date().getMonth() + 1
  const range = monthRange(y, m)
  const label = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
  return { ...range, label, year: y, month: m }
}

export async function getMonthlySummary({ from, to }) {
  const sales = await pool.query(
    `SELECT
       COALESCE(SUM(sa.quantity * p.selling_price), 0) AS revenue,
       COALESCE(SUM(sa.quantity * p.purchase_price), 0) AS cogs,
       COALESCE(SUM(sa.quantity * (p.selling_price - p.purchase_price)), 0) AS gross_profit
     FROM sales sa
     JOIN products p ON p.id = sa.product_id
     WHERE sa.sale_date BETWEEN $1 AND $2`,
    [from, to],
  )

  const purchases = await pool.query(
    `SELECT COALESCE(SUM(quantity * price_per_unit), 0) AS purchase_cost
     FROM purchases WHERE purchase_date BETWEEN $1 AND $2`,
    [from, to],
  )

  const expenses = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS operating_expenses
     FROM expenses WHERE expense_date BETWEEN $1 AND $2`,
    [from, to],
  )

  const revenue = Number(sales.rows[0].revenue)
  const grossProfit = Number(sales.rows[0].gross_profit)
  const operatingExpenses = Number(expenses.rows[0].operating_expenses)
  const purchaseCost = Number(purchases.rows[0].purchase_cost)

  return {
    revenue,
    cogs: Number(sales.rows[0].cogs),
    grossProfit,
    purchaseCost,
    operatingExpenses,
    totalExpenses: purchaseCost + operatingExpenses,
    netProfit: grossProfit - operatingExpenses,
  }
}

export async function getProductProfitability({ from, to }) {
  const { rows } = await pool.query(
    `SELECT
       p.id, p.name, p.sku, p.category,
       COALESCE(SUM(sa.quantity), 0)::int AS units_sold,
       COALESCE(SUM(sa.quantity * p.selling_price), 0) AS revenue,
       COALESCE(SUM(sa.quantity * p.purchase_price), 0) AS cogs,
       COALESCE(SUM(sa.quantity * (p.selling_price - p.purchase_price)), 0) AS gross_profit
     FROM products p
     LEFT JOIN sales sa ON sa.product_id = p.id AND sa.sale_date BETWEEN $1 AND $2
     GROUP BY p.id, p.name, p.sku, p.category
     HAVING COALESCE(SUM(sa.quantity), 0) > 0
     ORDER BY gross_profit DESC`,
    [from, to],
  )
  return rows
}

export async function getExpenseBreakdown({ from, to }) {
  const { rows } = await pool.query(
    `SELECT category, SUM(amount) AS amount
     FROM expenses
     WHERE expense_date BETWEEN $1 AND $2
     GROUP BY category
     ORDER BY amount DESC`,
    [from, to],
  )
  return rows
}

export async function getProfitTrend(months = 6) {
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
       COALESCE((
         SELECT SUM(sa.quantity * p.selling_price)
         FROM sales sa JOIN products p ON p.id = sa.product_id
         WHERE date_trunc('month', sa.sale_date) = m.month_start
       ), 0) AS revenue,
       COALESCE((
         SELECT SUM(e.amount) FROM expenses e
         WHERE date_trunc('month', e.expense_date) = m.month_start
       ), 0) + COALESCE((
         SELECT SUM(pu.quantity * pu.price_per_unit) FROM purchases pu
         WHERE date_trunc('month', pu.purchase_date) = m.month_start
       ), 0) AS expenses
     FROM months m
     ORDER BY m.month_start`,
    [months],
  )
  return rows.map((r) => ({
    label: r.label,
    revenue: Number(r.revenue),
    expenses: Number(r.expenses),
    profit: Number(r.revenue) - Number(r.expenses),
  }))
}
