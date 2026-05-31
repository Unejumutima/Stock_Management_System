import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
import passport from './config/passport.js'
import { env } from './config/env.js'
import { testConnection } from './config/db.js'
import apiRoutes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

import pgSession from 'connect-pg-simple'
const PostgresSession = pgSession(session)

const app = express()

// Security & logging
app.use(helmet())
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'))

/**
 * CORS — allow both the deployed frontend URL and localhost for development.
 * CLIENT_URL is the primary origin (set to the deployed frontend in production).
 * We also always allow localhost:5173 so local dev keeps working.
 */
const allowedOrigins = new Set([
  env.clientUrl,
  'http://localhost:5173',
  'http://localhost:4173', // vite preview
])

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true)
      if (allowedOrigins.has(origin)) return callback(null, true)
      callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  }),
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Session configuration for Passport (Google OAuth)
app.use(session({
  store: new PostgresSession({
    conString: env.databaseUrl,
  }),
  secret: env.jwt.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}))

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Health check (no auth — for deployment probes)
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Zuba House API is running' })
})

app.get('/', (_req, res) => {
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
      console.log(`[server] Zuba House API listening on port ${env.port}`)
      console.log(`[server] Environment: ${env.nodeEnv}`)
    })
  } catch (err) {
    console.error('[server] Failed to start:', err.message)
    process.exit(1)
  }
}

start()
