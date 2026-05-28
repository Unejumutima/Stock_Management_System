import { pool } from '../config/db.js'
import { STOCK_SUBQUERY, TOTAL_PURCHASED_SUBQUERY, TOTAL_SOLD_SUBQUERY } from '../utils/stockSql.js'


const PRODUCT_SELECT = `
  p.id, p.name, p.sku, p.category,
  p.purchase_price, p.selling_price,
  p.created_at,
  (${STOCK_SUBQUERY}) AS stock,
  (${TOTAL_PURCHASED_SUBQUERY}) AS total_purchased,
  (${TOTAL_SOLD_SUBQUERY}) AS total_sold
`

export async function findAll({ search, category } = {}) {
  const conditions = []
  const params = []
  let i = 1

  if (search) {
    conditions.push(`(p.name ILIKE $${i} OR p.sku ILIKE $${i} OR p.category ILIKE $${i})`)
    params.push(`%${search}%`)
    i++
  }
  if (category && category !== 'All categories') {
    conditions.push(`p.category = $${i}`)
    params.push(category)
    i++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT ${PRODUCT_SELECT} FROM products p ${where} ORDER BY p.name ASC`,
    params,
  )
  return rows
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT ${PRODUCT_SELECT} FROM products p WHERE p.id = $1`,
    [id],
  )
  return rows[0] || null
}

export async function create({ name, sku, category, purchasePrice, sellingPrice }) {
  const { rows } = await pool.query(
    `INSERT INTO products (name, sku, category, purchase_price, selling_price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, sku, category, purchase_price, selling_price, created_at`,
    [name, sku.toUpperCase(), category, purchasePrice, sellingPrice],
  )
  return findById(rows[0].id)
}

export async function update(id, fields) {
  const sets = []
  const params = []
  let i = 1

  const map = {
    name: 'name',
    sku: 'sku',
    category: 'category',
    purchasePrice: 'purchase_price',
    sellingPrice: 'selling_price',
  }

  for (const [key, col] of Object.entries(map)) {
    if (fields[key] !== undefined) {
      sets.push(`${col} = $${i}`)
      params.push(key === 'sku' ? String(fields[key]).toUpperCase() : fields[key])
      i++
    }
  }

  if (!sets.length) return findById(id)

  sets.push(`updated_at = NOW()`)
  params.push(id)

  await pool.query(`UPDATE products SET ${sets.join(', ')} WHERE id = $${i}`, params)
  return findById(id)
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id])
  return rowCount > 0
}
