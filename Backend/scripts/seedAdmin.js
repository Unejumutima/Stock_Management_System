import bcrypt from 'bcryptjs'
import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

const DEMO_EMAIL = 'honorine@zubahouse.com'
const DEMO_PASSWORD = 'Password123!'

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

async function main() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10)
  await client.connect()
  await client.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, 'Honorine M.', 'admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [DEMO_EMAIL, hash],
  )
  console.log(`Admin user ready: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
