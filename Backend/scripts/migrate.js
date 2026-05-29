
import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

async function migrate() {
  await client.connect()
  console.log('Connected to database. Running migrations...\n')

  // 1. Add google_id column to users (if it doesn't exist)
  await client.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE
  `)
  console.log('✓ users.google_id column ensured')

  // 2. Add is_approved column to users (if it doesn't exist)
  await client.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT true
  `)
  console.log('✓ users.is_approved column ensured')

  // 3. Make password_hash nullable (Google users won't have one)
  await client.query(`
    ALTER TABLE users
    ALTER COLUMN password_hash DROP NOT NULL
  `)
  console.log('✓ users.password_hash is now nullable')

  // 4. Add updated_at to users (if it doesn't exist)
  await client.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  `)
  console.log('✓ users.updated_at column ensured')

  // 5. Fix refresh_tokens — handle both old (INTEGER) and new (UUID) users.id
  //    First check what type users.id actually is in the live database
  const typeCheck = await client.query(`
    SELECT data_type
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'id'
  `)
  const usersIdType = typeCheck.rows[0]?.data_type
  console.log(`   users.id type in database: ${usersIdType}`)

  if (usersIdType === 'uuid') {
    // New schema — just recreate refresh_tokens with UUID FK
    await client.query(`DROP TABLE IF EXISTS refresh_tokens`)
    await client.query(`
      CREATE TABLE refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        token VARCHAR(500) NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        is_used BOOLEAN NOT NULL DEFAULT FALSE,
        is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    console.log('✓ refresh_tokens recreated with UUID user_id FK')
  } else {
    // Old schema — users.id is INTEGER. We need to migrate users table to UUID first.
    // Strategy: rename old table, create new one with UUID, copy data, recreate refresh_tokens.
    console.log('   users.id is INTEGER — migrating users table to UUID...')

    await client.query(`DROP TABLE IF EXISTS refresh_tokens`)
    console.log('   ✓ old refresh_tokens dropped')

    // Rename old users table
    await client.query(`ALTER TABLE users RENAME TO users_old`)

    // Create new users table with UUID primary key
    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        full_name VARCHAR(120) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        google_id VARCHAR(255) UNIQUE,
        is_approved BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    // Copy existing users into new table (generate new UUIDs for them)
    await client.query(`
      INSERT INTO users (email, password_hash, full_name, role, is_approved, created_at)
      SELECT email, password_hash, full_name, role,
             COALESCE(is_approved, true),
             created_at
      FROM users_old
    `)

    const copied = await client.query(`SELECT COUNT(*) FROM users`)
    console.log(`   ✓ Copied ${copied.rows[0].count} user(s) to new UUID-based users table`)

    // Drop old table
    await client.query(`DROP TABLE users_old`)
    console.log('   ✓ old users_old table dropped')

    // Now create refresh_tokens with UUID FK
    await client.query(`
      CREATE TABLE refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        token VARCHAR(500) NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        is_used BOOLEAN NOT NULL DEFAULT FALSE,
        is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    console.log('✓ refresh_tokens created with UUID user_id FK')
  }

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens (token)
  `)
  console.log('✓ refresh_tokens index created')

  console.log('\n✅ All migrations complete. You can now restart the backend.')
  await client.end()
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
