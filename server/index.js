import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import photoRoutes from './routes/photos.js'
import pageRoutes from './routes/pages.js'
import adminRoutes from './routes/admin.js'
import pool from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || process.env.API_PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/photos', photoRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

// Serve built React app if dist/ exists (production / Replit deployment)
const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`)
  // Auto-migrate: add is_banned column if it doesn't exist
  pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false`)
    .catch(() => {})
})
