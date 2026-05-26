import { pool } from '../config/db.js'

/**
 * Creates and saves a new refresh token to the database.
 * @param {number} userId - The ID of the user.
 * @param {string} token - The signed JWT refresh token string.
 * @param {Date} expiresAt - The expiration timestamp.
 * @returns {Promise<object>} The created database record.
 */
export async function createRefreshToken(userId, token, expiresAt) {
  const { rows } = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, token, expires_at, is_used, is_revoked, created_at`,
    [userId, token, expiresAt]
  )
  return rows[0]
}

/**
 * Looks up a refresh token record in the database.
 * @param {string} token - The refresh token string.
 * @returns {Promise<object|null>} The token record or null.
 */
export async function findRefreshToken(token) {
  const { rows } = await pool.query(
    `SELECT id, user_id, token, expires_at, is_used, is_revoked, created_at
     FROM refresh_tokens
     WHERE token = $1`,
    [token]
  )
  return rows[0] || null
}

/**
 * Marks a refresh token as already used (for rotation verification).
 * @param {string} token - The refresh token string.
 * @returns {Promise<object>} The updated token record.
 */
export async function markAsUsed(token) {
  const { rows } = await pool.query(
    `UPDATE refresh_tokens
     SET is_used = TRUE
     WHERE token = $1
     RETURNING id, user_id, token, expires_at, is_used, is_revoked, created_at`,
    [token]
  )
  return rows[0]
}

/**
 * Revokes all active refresh tokens for a user (e.g., on replay attack detection).
 * @param {number} userId - The user's ID.
 */
export async function revokeAllUserTokens(userId) {
  await pool.query(
    `UPDATE refresh_tokens
     SET is_revoked = TRUE
     WHERE user_id = $1`,
    [userId]
  )
}

/**
 * Revokes a specific refresh token (e.g., on logout).
 * @param {string} token - The refresh token string.
 */
export async function revokeToken(token) {
  await pool.query(
    `UPDATE refresh_tokens
     SET is_revoked = TRUE
     WHERE token = $1`,
    [token]
  )
}

/**
 * Deletes all expired refresh tokens from the database.
 * @returns {Promise<number>} Number of deleted rows.
 */
export async function deleteExpiredTokens() {
  const { rowCount } = await pool.query(
    `DELETE FROM refresh_tokens WHERE expires_at < NOW()`
  )
  return rowCount
}
