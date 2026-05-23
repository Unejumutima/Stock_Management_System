import { pool } from '../config/db.js'

export async function findAll(filters = {}) {
  const conditions = []
  const params = []
  let i = 1

  if (filters.category && filters.category !== 'All categories') {
    conditions.push(`category = $${i++}`)
    params.push(filters.category)
  }
  if (filters.from) {
    conditions.push(`expense_date >= $${i++}`)
    params.push(filters.from)
  }
  if (filters.to) {
    conditions.push(`expense_date <= $${i++}`)
    params.push(filters.to)
  }
  if (filters.search) {
    conditions.push(`(category ILIKE $${i} OR notes ILIKE $${i})`)
    params.push(`%${filters.search}%`)
    i++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT id, category, amount, expense_date, notes, created_at, updated_at
     FROM expenses ${where}
     ORDER BY expense_date DESC, created_at DESC`,
    params,
  )
  return rows
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, category, amount, expense_date, notes, created_at, updated_at
     FROM expenses WHERE id = $1`,
    [id],
  )
  return rows[0] || null
}

export async function create({ category, amount, expenseDate, notes }) {
  const { rows } = await pool.query(
    `INSERT INTO expenses (category, amount, expense_date, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [category, amount, expenseDate, notes || null],
  )
  return rows[0]
}

export async function update(id, fields) {
  const sets = []
  const params = []
  let i = 1

  if (fields.category !== undefined) {
    sets.push(`category = $${i++}`)
    params.push(fields.category)
  }
  if (fields.amount !== undefined) {
    sets.push(`amount = $${i++}`)
    params.push(fields.amount)
  }
  if (fields.expenseDate !== undefined) {
    sets.push(`expense_date = $${i++}`)
    params.push(fields.expenseDate)
  }
  if (fields.notes !== undefined) {
    sets.push(`notes = $${i++}`)
    params.push(fields.notes)
  }

  if (!sets.length) return findById(id)

  sets.push('updated_at = NOW()')
  params.push(id)

  await pool.query(`UPDATE expenses SET ${sets.join(', ')} WHERE id = $${i}`, params)
  return findById(id)
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM expenses WHERE id = $1', [id])
  return rowCount > 0
}

export async function getSummary(filters = {}) {
  const conditions = []
  const params = []
  let i = 1

  if (filters.from) {
    conditions.push(`expense_date >= $${i++}`)
    params.push(filters.from)
  }
  if (filters.to) {
    conditions.push(`expense_date <= $${i++}`)
    params.push(filters.to)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query(
    `SELECT
       COUNT(*)::int AS total_count,
       COALESCE(SUM(amount), 0) AS total_amount
     FROM expenses ${where}`,
    params,
  )

  const byCategory = await pool.query(
    `SELECT category, SUM(amount) AS amount
     FROM expenses ${where}
     GROUP BY category
     ORDER BY amount DESC
     LIMIT 1`,
    params,
  )

  return {
    ...rows[0],
    top_category: byCategory.rows[0]?.category || null,
    top_category_amount: byCategory.rows[0]?.amount || 0,
  }
}
