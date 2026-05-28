import express from 'express'
import pool from '../db.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users, photos, categories, banned] = await Promise.all([
      pool.query('SELECT COUNT(*)::int as count FROM users'),
      pool.query('SELECT COUNT(*)::int as count FROM photos'),
      pool.query('SELECT COUNT(*)::int as count FROM categories'),
      pool.query('SELECT COUNT(*)::int as count FROM users WHERE is_banned = true'),
    ])
    res.json({
      users: users.rows[0].count,
      photos: photos.rows[0].count,
      categories: categories.rows[0].count,
      banned: banned.rows[0].count,
    })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_banned, created_at FROM users ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.patch('/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body
    if (!['user', 'admin'].includes(role))
      return res.status(400).json({ error: 'Неверная роль' })
    if (parseInt(req.params.id) === req.user.id)
      return res.status(400).json({ error: 'Нельзя изменить свою роль' })
    const result = await pool.query(
      'UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role, is_banned',
      [role, req.params.id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Пользователь не найден' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.patch('/users/:id/ban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id)
      return res.status(400).json({ error: 'Нельзя заблокировать себя' })
    const current = await pool.query('SELECT is_banned FROM users WHERE id=$1', [req.params.id])
    if (current.rows.length === 0)
      return res.status(404).json({ error: 'Пользователь не найден' })
    const newBanned = !current.rows[0].is_banned
    const result = await pool.query(
      'UPDATE users SET is_banned=$1 WHERE id=$2 RETURNING id, name, email, role, is_banned',
      [newBanned, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id)
      return res.status(400).json({ error: 'Нельзя удалить свой аккаунт' })
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING id', [req.params.id])
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Пользователь не найден' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.post('/categories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body
    if (!name || !slug)
      return res.status(400).json({ error: 'Название и slug обязательны' })
    const result = await pool.query(
      'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    )
    res.json(result.rows[0])
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Такой slug уже существует' })
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.patch('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body
    if (!name || !slug)
      return res.status(400).json({ error: 'Название и slug обязательны' })
    const result = await pool.query(
      'UPDATE categories SET name=$1, slug=$2 WHERE id=$3 RETURNING *',
      [name, slug, req.params.id]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Категория не найдена' })
    res.json(result.rows[0])
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Такой slug уже существует' })
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.delete('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router
