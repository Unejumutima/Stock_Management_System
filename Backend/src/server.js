import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { testConnection } from './config/db.js'
import apiRoutes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()

// Security & logging
app.use(helmet())
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'))

// CORS — allow React frontend (Axios)
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check (no auth — for deployment probes)
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Zuba House API is running' })
})

// All REST modules under /api
app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  try {
    await testConnection()
    app.listen(env.port, () => {
      console.log(`[server] Zuba House API listening on http://localhost:${env.port}`)
      console.log(`[server] Environment: ${env.nodeEnv}`)
      console.log(`[server] API base: http://localhost:${env.port}/api`)
    })
  } catch (err) {
    console.error('[server] Failed to start:', err.message)
    process.exit(1)
  }
}

start()
