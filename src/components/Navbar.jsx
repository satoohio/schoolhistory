import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, GraduationCap, LogOut, Settings, User, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = (e) => { if (!e.target.closest('#user-menu')) setDropdown(false) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setMobileOpen(false); setDropdown(false) }

  const links = [
    { to: '/', label: 'Главная' },
    { to: '/gallery', label: 'Галерея' },
    { to: '/about', label: 'О школе' },
    { to: '/contacts', label: 'Контакты' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? '#fff' : 'rgba(255,255,255,0.96)',
      boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.10)' : '0 1px 0 rgba(0,0,0,0.07)',
      backdropFilter: 'blur(12px)',
      transition: 'box-shadow 0.3s',
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '8px' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '1.1rem', color: '#1d4ed8', marginRight: '8px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: '#1d4ed8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={19} color="#fff" />
          </div>
          <span style={{ display: 'none' }} className="logo-text">Школа №1</span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '2px', flex: 1 }} className="desktop-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              style={({ isActive }) => ({
                padding: '7px 14px', borderRadius: 9, fontSize: '0.9rem', fontWeight: 500,
                color: isActive ? '#1d4ed8' : '#475569',
                background: isActive ? '#eff6ff' : 'transparent',
                transition: 'all 0.15s',
              })}
              onMouseEnter={e => { if (!e.currentTarget.style.background.includes('eff6ff')) e.currentTarget.style.background = '#f8fafc' }}
              onMouseLeave={e => { if (!e.currentTarget.style.background.includes('eff6ff')) e.currentTarget.style.background = 'transparent' }}
            >{l.label}</NavLink>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="desktop-auth">
          {user ? (
            <div id="user-menu" style={{ position: 'relative' }}>
              <button onClick={() => setDropdown(!dropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                <div style={{ width: 28, height: 28, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="#1d4ed8" />
                </div>
                {user.name}
                <ChevronDown size={13} color="#94a3b8" />
              </button>
              {dropdown && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', width: 200, background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.13)', border: '1px solid #f1f5f9', overflow: 'hidden', zIndex: 200 }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#94a3b8' }}>{user.email}</div>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdown(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', fontSize: '0.875rem', color: '#374151' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Settings size={14} /> Панель админа
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', fontSize: '0.875rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={14} /> Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{ padding: '8px 16px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 500, color: '#374151', border: '1.5px solid #e2e8f0', background: '#fff' }}>Войти</Link>
              <Link to="/register" style={{ padding: '8px 18px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#1d4ed8' }}>Регистрация</Link>
            </>
          )}
        </div>

        {/* Burger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="burger-btn"
          style={{ display: 'none', padding: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#374151' }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid #f1f5f9', background: '#fff', padding: '12px 16px 16px' }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'block', padding: '10px 14px', borderRadius: 9, marginBottom: 2,
                fontSize: '0.9rem', fontWeight: 500,
                color: isActive ? '#1d4ed8' : '#374151',
                background: isActive ? '#eff6ff' : 'transparent',
              })}>{l.label}</NavLink>
          ))}
          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 8, paddingTop: 12 }}>
            {user ? (
              <>
                <div style={{ padding: '8px 14px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{user.name}</div>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 14px', color: '#1d4ed8', fontSize: '0.875rem' }}>Панель админа</Link>}
                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: '0.875rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Выйти</button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Войти</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#1d4ed8', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Регистрация</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-auth { display: none !important; }
          .burger-btn { display: flex !important; margin-left: auto; }
          .logo-text { display: block !important; }
        }
        @media (min-width: 769px) {
          .logo-text { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
