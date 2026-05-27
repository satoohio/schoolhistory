import express from 'express'
import pool from '../db.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pages WHERE slug = $1', [req.params.slug])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Страница не найдена' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.put('/:slug', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content } = req.body
    const result = await pool.query(
      `INSERT INTO pages (slug, title, content, updated_at) VALUES ($1, $2, $3, NOW())
       ON CONFLICT (slug) DO UPDATE SET title=$2, content=$3, updated_at=NOW() RETURNING *`,
      [req.params.slug, title, content]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router
