import { pool } from '../config/db.js'

/** Maps a raw DB row to the camelCase shape the frontend expects */
function mapUser(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    googleId: row.google_id,
    isApproved: row.is_approved,
    createdAt: row.created_at,
  }
}

export async function getAllUsers() {
  const { rows } = await pool.query(
    `SELECT id, email, full_name, role, google_id, is_approved, created_at
     FROM users
     ORDER BY created_at DESC`,
  )
  return rows.map(mapUser)
}

export async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, full_name, role, google_id, is_approved, created_at
     FROM users WHERE id = $1`,
    [id],
  )
  return mapUser(rows[0])
}

export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, email, full_name, role, google_id, is_approved, created_at
     FROM users WHERE email = $1`,
    [email.toLowerCase()],
  )
  return mapUser(rows[0])
}

export async function getUserByGoogleId(googleId) {
  const { rows } = await pool.query(
    `SELECT id, email, full_name, role, google_id, is_approved, created_at
     FROM users WHERE google_id = $1`,
    [googleId],
  )
  return mapUser(rows[0])
}

export async function createUser({ email, fullName, role = 'user', googleId = null, isApproved = true }) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, full_name, role, google_id, is_approved)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, full_name, role, google_id, is_approved, created_at`,
    [email.toLowerCase(), fullName, role, googleId, isApproved],
  )
  return mapUser(rows[0])
}

export async function updateUser(id, { email, fullName, role, isApproved, googleId }) {
  const { rows } = await pool.query(
    `UPDATE users
     SET email      = COALESCE($1, email),
         full_name  = COALESCE($2, full_name),
         role       = COALESCE($3, role),
         is_approved = COALESCE($4, is_approved),
         google_id  = COALESCE($5, google_id),
         updated_at = NOW()
     WHERE id = $6
     RETURNING id, email, full_name, role, google_id, is_approved, created_at`,
    [
      email ? email.toLowerCase() : null,
      fullName ?? null,
      role ?? null,
      isApproved ?? null,
      googleId ?? null,
      id,
    ],
  )
  return mapUser(rows[0])
}

export async function deleteUser(id) {
  const { rows } = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [id],
  )
  return rows[0] || null
}

export async function updateUserApproval(id, isApproved) {
  const { rows } = await pool.query(
    `UPDATE users
     SET is_approved = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, email, full_name, role, google_id, is_approved, created_at`,
    [isApproved, id],
  )
  return mapUser(rows[0])
}
