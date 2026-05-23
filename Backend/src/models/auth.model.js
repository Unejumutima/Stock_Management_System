import { pool } from '../config/db.js'


export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash, full_name, role, created_at
     FROM users WHERE email = $1`,
    [email.toLowerCase()],
  )
  return rows[0] || null
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, full_name, role, created_at
     FROM users WHERE id = $1`,
    [id],
  )
  return rows[0] || null
}

export async function createUser({ email, passwordHash, fullName, role = 'admin' }) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, role, created_at`,
    [email.toLowerCase(), passwordHash, fullName, role],
  )
  return rows[0]
}
