import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import pool from '../db.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    if (ext && mime) cb(null, true)
    else cb(new Error('Только изображения (jpg, png, gif, webp)'))
  }
})

router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 50, offset = 0 } = req.query
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, u.name as uploader_name
      FROM photos p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.uploaded_by = u.id
      WHERE 1=1
    `
    const params = []
    if (category) { params.push(category); query += ` AND c.slug = $${params.length}` }
    if (featured === 'true') { query += ` AND p.is_featured = true` }
    params.push(parseInt(limit)); query += ` ORDER BY p.created_at DESC LIMIT $${params.length}`
    params.push(parseInt(offset)); query += ` OFFSET $${params.length}`

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, COUNT(p.id)::int as photo_count
      FROM categories c
      LEFT JOIN photos p ON p.category_id = c.id
      GROUP BY c.id ORDER BY c.name
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.post('/', authenticateToken, requireAdmin, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Файл не загружен' })
    const { title, description, category_id, is_featured } = req.body
    if (!title) return res.status(400).json({ error: 'Название обязательно' })
    const url = `/uploads/${req.file.filename}`
    const result = await pool.query(
      `INSERT INTO photos (title, description, filename, url, category_id, uploaded_by, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description || null, req.file.filename, url,
       category_id ? parseInt(category_id) : null, req.user.id, is_featured === 'true']
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка загрузки' })
  }
})

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT filename FROM photos WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Фото не найдено' })
    const { filename } = result.rows[0]
    const filePath = `uploads/${filename}`
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    await pool.query('DELETE FROM photos WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, category_id, is_featured } = req.body
    const result = await pool.query(
      `UPDATE photos SET title=$1, description=$2, category_id=$3, is_featured=$4
       WHERE id=$5 RETURNING *`,
      [title, description, category_id ? parseInt(category_id) : null, is_featured, req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Фото не найдено' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router
