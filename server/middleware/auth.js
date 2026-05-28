import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is not set in environment variables!')
  console.error('   Please create a .env file with JWT_SECRET=your_secret_key')
  console.error('   For production, use a strong random string (e.g., openssl rand -hex 32)')
  process.exit(1)
}

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
