import pg from 'pg'
import { env } from './env.js'

const { Pool } = pg

/**
 * Shared PostgreSQL connection pool.
 * All models import this pool and run parameterized queries.
 */
export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
})

pool.on('connect', () => {
  if (env.nodeEnv === 'development') {
    console.log('[db] Connected to PostgreSQL')
  }
})

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error', err)
})

/** Verify database is reachable on startup */
export async function testConnection() {
  const client = await pool.connect()
  try {
    await client.query('SELECT 1')
    return true
  } finally {
    client.release()
  }
}
