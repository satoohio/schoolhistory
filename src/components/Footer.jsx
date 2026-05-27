import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">Школа №1</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Добро пожаловать в нашу школу — место, где знания встречаются с вдохновением.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">Навигация</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Главная'], ['/gallery', 'Галерея'], ['/about', 'О школе'], ['/contacts', 'Контакты']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-blue-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold text-white mb-3">Контакты</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin size={14} className="text-blue-400 shrink-0" /> г. Москва, ул. Школьная, д. 1</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-blue-400 shrink-0" /> +7 (495) 000-00-00</li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-blue-400 shrink-0" /> school@example.ru</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Школа №1. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
