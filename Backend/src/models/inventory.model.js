import { pool } from '../config/db.js'
import { STOCK_SUBQUERY, TOTAL_PURCHASED_SUBQUERY, TOTAL_SOLD_SUBQUERY } from '../utils/stockSql.js'


const INVENTORY_SELECT = `
  p.id, p.name, p.sku, p.category,
  p.purchase_price, p.selling_price,
  (${STOCK_SUBQUERY}) AS stock,
  (${TOTAL_PURCHASED_SUBQUERY}) AS total_purchased,
  (${TOTAL_SOLD_SUBQUERY}) AS total_sold,
  (${STOCK_SUBQUERY}) * p.purchase_price AS inventory_value
`

export async function findInventoryList({ search, category, lowStockThreshold = 75 } = {}) {
  const conditions = []
  const params = []
  let i = 1

  if (search) {
    conditions.push(`(p.name ILIKE $${i} OR p.sku ILIKE $${i} OR p.category ILIKE $${i})`)
    params.push(`%${search}%`)
    i++
  }
  if (category && category !== 'All categories') {
    conditions.push(`p.category = $${i++}`)
    params.push(category)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT ${INVENTORY_SELECT},
       CASE
         WHEN (${STOCK_SUBQUERY}) <= 0 THEN 'out_of_stock'
         WHEN (${STOCK_SUBQUERY}) < $${i} THEN 'low_stock'
         ELSE 'in_stock'
       END AS status
     FROM products p
     ${where}
     ORDER BY stock ASC, p.name ASC`,
    [...params, lowStockThreshold],
  )
  return rows
}

export async function findLowStock(threshold = 75) {
  const { rows } = await pool.query(
    `SELECT ${INVENTORY_SELECT}
     FROM products p
     WHERE (${STOCK_SUBQUERY}) > 0 AND (${STOCK_SUBQUERY}) < $1
     ORDER BY stock ASC`,
    [threshold],
  )
  return rows
}

export async function getInventoryTotals() {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*)::int AS product_count,
       COALESCE(SUM((${STOCK_SUBQUERY})), 0)::int AS total_units,
       COALESCE(SUM((${STOCK_SUBQUERY}) * p.purchase_price), 0) AS total_inventory_value,
       COUNT(*) FILTER (WHERE (${STOCK_SUBQUERY}) <= 0)::int AS out_of_stock_count,
       COUNT(*) FILTER (WHERE (${STOCK_SUBQUERY}) > 0 AND (${STOCK_SUBQUERY}) < 75)::int AS low_stock_count
     FROM products p`,
  )
  return rows[0]
}
