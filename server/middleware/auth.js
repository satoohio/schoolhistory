import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'schoolhistory_secret_key_2024'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Требуется авторизация' })
  try {
    const user = jwt.verify(token, JWT_SECRET)
    req.user = user
    next()
  } catch {
    return res.status(403).json({ error: 'Неверный токен' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Требуются права администратора' })
  }
  next()
}

export { JWT_SECRET }
