import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, GraduationCap, LogOut, Settings, User } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false) }

  const links = [
    { to: '/', label: 'Главная' },
    { to: '/gallery', label: 'Галерея' },
    { to: '/about', label: 'О школе' },
    { to: '/contacts', label: 'Контакты' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="hidden sm:block">Школа №1</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`
                }
              >{l.label}</NavLink>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-700" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100">{user.email}</div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Settings size={14} /> Админ панель
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <LogOut size={14} /> Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 rounded-lg hover:bg-slate-50 transition-colors">
                  Войти
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors">
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`
              }>{l.label}</NavLink>
          ))}
          <div className="pt-2 border-t border-slate-100 mt-2">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm font-medium text-slate-700">{user.name}</div>
                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-blue-700">Админ панель</Link>}
                <button onClick={() => { handleLogout(); setOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-red-500">Выйти</button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm font-medium border border-blue-700 text-blue-700 rounded-lg">Войти</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-2 text-sm font-medium bg-blue-700 text-white rounded-lg">Регистрация</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
