import { pool } from '../config/db.js'

const SALE_SELECT = `
  sa.id, sa.product_id, sa.quantity, sa.sale_date, sa.created_at,
  p.name AS product_name, p.sku, p.category,
  p.selling_price,
  (sa.quantity * p.selling_price) AS total_revenue
`

export async function findAll(filters = {}) {
  const conditions = []
  const params = []
  let i = 1

  if (filters.productId) {
    conditions.push(`sa.product_id = $${i++}`)
    params.push(filters.productId)
  }
  if (filters.category && filters.category !== 'All categories') {
    conditions.push(`p.category = $${i++}`)
    params.push(filters.category)
  }
  if (filters.from) {
    conditions.push(`sa.sale_date >= $${i++}`)
    params.push(filters.from)
  }
  if (filters.to) {
    conditions.push(`sa.sale_date <= $${i++}`)
    params.push(filters.to)
  }
  if (filters.search) {
    conditions.push(`(p.name ILIKE $${i} OR p.sku ILIKE $${i} OR p.category ILIKE $${i})`)
    params.push(`%${filters.search}%`)
    i++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT ${SALE_SELECT}
     FROM sales sa
     JOIN products p ON p.id = sa.product_id
     ${where}
     ORDER BY sa.sale_date DESC, sa.created_at DESC`,
    params,
  )
  return rows
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT ${SALE_SELECT}
     FROM sales sa
     JOIN products p ON p.id = sa.product_id
     WHERE sa.id = $1`,
    [id],
  )
  return rows[0] || null
}

export async function create({ productId, quantity, saleDate }) {
  const { rows } = await pool.query(
    `INSERT INTO sales (product_id, quantity, sale_date)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [productId, quantity, saleDate],
  )
  return findById(rows[0].id)
}

export async function getSummary(filters = {}) {
  const conditions = []
  const params = []
  let i = 1

  if (filters.from) {
    conditions.push(`sa.sale_date >= $${i++}`)
    params.push(filters.from)
  }
  if (filters.to) {
    conditions.push(`sa.sale_date <= $${i++}`)
    params.push(filters.to)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT
       COUNT(*)::int AS total_sales,
       COALESCE(SUM(sa.quantity), 0)::int AS total_units,
       COALESCE(SUM(sa.quantity * p.selling_price), 0) AS total_revenue,
       COALESCE(SUM(sa.quantity * p.purchase_price), 0) AS total_cost,
       COALESCE(SUM(sa.quantity * (p.selling_price - p.purchase_price)), 0) AS gross_profit
     FROM sales sa
     JOIN products p ON p.id = sa.product_id
     ${where}`,
    params,
  )
  return rows[0]
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM sales WHERE id = $1', [id])
  return rowCount > 0
}
