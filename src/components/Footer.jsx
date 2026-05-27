import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', marginTop: 'auto' }}>
      <div className="wrap" style={{ padding: '56px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', paddingBottom: '40px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: '#2563eb', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={19} color="#fff" />
              </div>
              <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem' }}>Школа №1</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#64748b' }}>
              Место, где знания встречаются с вдохновением и каждый ребёнок раскрывает свой талант.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Навигация</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/', 'Главная'], ['/gallery', 'Галерея'], ['/about', 'О школе'], ['/contacts', 'Контакты']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: '0.875rem', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#60a5fa'}
                    onMouseLeave={e => e.target.style.color = '#94a3b8'}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Контакты</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                [MapPin, 'г. Москва, ул. Школьная, д. 1'],
                [Phone, '+7 (495) 000-00-00'],
                [Mail, 'school@example.ru'],
              ].map(([Icon, text]) => (
                <li key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Icon size={14} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', padding: '20px 0', textAlign: 'center', fontSize: '0.8rem', color: '#475569' }}>
          © {new Date().getFullYear()} Школа №1. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
