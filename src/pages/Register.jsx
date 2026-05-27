import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Eye, EyeOff, UserPlus } from 'lucide-react'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Пароли не совпадают'); return }
    if (form.password.length < 6) { setError('Пароль не менее 6 символов'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ошибка регистрации'); return }
      login(data.token, data.user)
      navigate('/')
    } catch { setError('Ошибка соединения') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(29,78,216,0.3)' }}>
            <GraduationCap size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Создать аккаунт</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Регистрация для доступа к галерее</p>
        </div>

        <div className="card" style={{ padding: '36px 32px' }}>
          {error && (
            <div style={{ marginBottom: 18, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.875rem' }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>Ваше имя</label>
              <input type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Иван Иванов" className="input" autoComplete="name" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.ru" className="input" autoComplete="email" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>Пароль</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Минимум 6 символов" className="input"
                  style={{ paddingRight: 44 }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>Подтвердите пароль</label>
              <input type="password" required value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Повторите пароль" className="input" autoComplete="new-password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 6, padding: '13px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}>
              <UserPlus size={17} /> {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: 20 }}>
            Уже есть аккаунт?{' '}
            <Link to="/login" style={{ color: '#1d4ed8', fontWeight: 600 }}>Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
