import { pool } from '../config/db.js'

const PURCHASE_SELECT = `
  pu.id, pu.product_id, pu.quantity, pu.price_per_unit, pu.purchase_date, pu.created_at,
  p.name AS product_name, p.sku, p.category,
  (pu.quantity * pu.price_per_unit) AS total_cost
`

export async function findAll(filters = {}) {
  const conditions = []
  const params = []
  let i = 1

  if (filters.productId) {
    conditions.push(`pu.product_id = $${i++}`)
    params.push(filters.productId)
  }
  if (filters.category && filters.category !== 'All categories') {
    conditions.push(`p.category = $${i++}`)
    params.push(filters.category)
  }
  if (filters.from) {
    conditions.push(`pu.purchase_date >= $${i++}`)
    params.push(filters.from)
  }
  if (filters.to) {
    conditions.push(`pu.purchase_date <= $${i++}`)
    params.push(filters.to)
  }
  if (filters.search) {
    conditions.push(`(p.name ILIKE $${i} OR p.sku ILIKE $${i} OR p.category ILIKE $${i})`)
    params.push(`%${filters.search}%`)
    i++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT ${PURCHASE_SELECT}
     FROM purchases pu
     JOIN products p ON p.id = pu.product_id
     ${where}
     ORDER BY pu.purchase_date DESC, pu.created_at DESC`,
    params,
  )
  return rows
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT ${PURCHASE_SELECT}
     FROM purchases pu
     JOIN products p ON p.id = pu.product_id
     WHERE pu.id = $1`,
    [id],
  )
  return rows[0] || null
}

export async function create({ productId, quantity, pricePerUnit, purchaseDate }) {
  const { rows } = await pool.query(
    `INSERT INTO purchases (product_id, quantity, price_per_unit, purchase_date)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [productId, quantity, pricePerUnit, purchaseDate],
  )
  return findById(rows[0].id)
}

export async function getSummary(filters = {}) {
  const conditions = []
  const params = []
  let i = 1

  if (filters.from) {
    conditions.push(`pu.purchase_date >= $${i++}`)
    params.push(filters.from)
  }
  if (filters.to) {
    conditions.push(`pu.purchase_date <= $${i++}`)
    params.push(filters.to)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT
       COUNT(*)::int AS total_purchases,
       COALESCE(SUM(pu.quantity), 0)::int AS total_units,
       COALESCE(SUM(pu.quantity * pu.price_per_unit), 0) AS total_cost
     FROM purchases pu
     ${where}`,
    params,
  )
  return rows[0]
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM purchases WHERE id = $1', [id])
  return rowCount > 0
}
