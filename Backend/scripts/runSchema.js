import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8')

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

async function main() {
  await client.connect()
  await client.query(sql)
  console.log('Schema applied successfully.')
  await client.end()
}

main().catch((err) => {
  console.error('Schema failed:', err.message)
  process.exit(1)
})
