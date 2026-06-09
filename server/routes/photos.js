import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import pool from '../db.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// ── Cloudinary (production) or local disk (development) ─────────────────────
let uploadMiddleware
let getFileUrl
let deleteFile

if (process.env.CLOUDINARY_URL) {
  const { v2: cloudinary } = await import('cloudinary')
  const { CloudinaryStorage } = await import('multer-storage-cloudinary')

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'school-gallery',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  })

  uploadMiddleware = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
  }).single('photo')

  getFileUrl = (req) => req.file.path
  deleteFile = async (filename) => {
    try { await cloudinary.uploader.destroy(`school-gallery/${filename}`) } catch {}
  }
} else {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = 'uploads/'
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      cb(null, dir)
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, unique + path.extname(file.originalname))
    },
  })

  uploadMiddleware = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|gif|webp/
      const ext = allowed.test(path.extname(file.originalname).toLowerCase())
      const mime = allowed.test(file.mimetype)
      if (ext && mime) cb(null, true)
      else cb(new Error('Только изображения (jpg, png, gif, webp)'))
    },
  }).single('photo')

  getFileUrl = (req) => `/uploads/${req.file.filename}`
  deleteFile = async (filename) => {
    const filePath = `uploads/${filename}`
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }
}

// ── GET /api/photos — public gallery (only visible photos) ──────────────────
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 20, offset = 0, admin } = req.query
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, u.name as uploader_name
      FROM photos p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.uploaded_by = u.id
      WHERE 1=1
    `
    const params = []

    // Admin mode: show all photos including hidden
    if (admin !== 'true') {
      query += ` AND p.is_visible = true`
    }

    if (category) { params.push(category); query += ` AND c.slug = $${params.length}` }
    if (featured === 'true') { query += ` AND p.is_featured = true` }
    params.push(parseInt(limit));  query += ` ORDER BY p.created_at DESC LIMIT $${params.length}`
    params.push(parseInt(offset)); query += ` OFFSET $${params.length}`

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Photos fetch error:', err.message)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// ── GET /api/photos/categories ───────────────────────────────────────────────
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, COUNT(p.id)::int as photo_count
      FROM categories c
      LEFT JOIN photos p ON p.category_id = c.id AND p.is_visible = true
      GROUP BY c.id ORDER BY c.name
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// ── POST /api/photos — upload ────────────────────────────────────────────────
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message })
    try {
      if (!req.file) return res.status(400).json({ error: 'Файл не загружен' })
      const { title, description, category_id, is_featured } = req.body
      if (!title) return res.status(400).json({ error: 'Название обязательно' })

      const url = getFileUrl(req)
      const filename = req.file.filename || req.file.public_id || req.file.originalname

      const result = await pool.query(
        `INSERT INTO photos (title, description, filename, url, category_id, uploaded_by, is_featured, is_visible)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *`,
        [title, description || null, filename, url,
         category_id ? parseInt(category_id) : null, req.user.id, is_featured === 'true']
      )
      res.json(result.rows[0])
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Ошибка загрузки' })
    }
  })
})

// ── DELETE /api/photos/:id ───────────────────────────────────────────────────
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT filename FROM photos WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Фото не найдено' })
    await deleteFile(result.rows[0].filename)
    await pool.query('DELETE FROM photos WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// ── PATCH /api/photos/:id — edit meta + visibility ──────────────────────────
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const allowed = ['title', 'description', 'category_id', 'is_featured', 'is_visible']
    const fields = []
    const values = []

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        values.push(
          key === 'category_id'
            ? (req.body[key] ? parseInt(req.body[key]) : null)
            : req.body[key]
        )
        fields.push(`${key}=$${values.length}`)
      }
    }

    if (fields.length === 0) return res.status(400).json({ error: 'Нет полей для обновления' })

    values.push(req.params.id)
    const result = await pool.query(
      `UPDATE photos SET ${fields.join(', ')} WHERE id=$${values.length} RETURNING *`,
      values
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Фото не найдено' })
    res.json(result.rows[0])
  } catch (err) {
    console.error('PATCH photo error:', err.message)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router
