import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Images, BookOpen, Trophy, Users, ArrowRight, Star } from 'lucide-react'
import Lightbox from '../components/Lightbox'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [lbIndex, setLbIndex] = useState(null)

  useEffect(() => {
    fetch('/api/photos?featured=true&limit=6')
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setFeatured(data) : [])
      .catch(() => {})
  }, [])

  const stats = [
    { icon: Users, value: '1200+', label: 'Учеников' },
    { icon: BookOpen, value: '85', label: 'Учителей' },
    { icon: Trophy, value: '200+', label: 'Наград' },
    { icon: Images, value: '70+', label: 'Лет истории' },
  ]

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 0 720 80 0 20L0 80Z" fill="#f8fafc" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-700/40 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-600/40">
              <Star size={14} className="fill-blue-300 text-blue-300" /> Добро пожаловать в Школу №1
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              Знания.<br />
              <span className="text-amber-400">Творчество.</span><br />
              Будущее.
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-lg">
              Мы создаём среду, где каждый ученик раскрывает свой потенциал и готовится к вызовам современного мира.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/gallery" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-slate-900 font-semibold rounded-xl hover:bg-amber-300 transition-all hover:scale-105 shadow-lg">
                <Images size={18} /> Смотреть галерею
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20">
                О нашей школе <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon size={20} className="text-blue-700" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{value}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured gallery */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Школьная жизнь</h2>
              <p className="text-slate-500 mt-1">Лучшие моменты наших учеников</p>
            </div>
            <Link to="/gallery" className="inline-flex items-center gap-1 text-blue-700 font-medium hover:gap-2 transition-all text-sm">
              Вся галерея <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {featured.map((photo, i) => (
              <div key={photo.id}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '4/3' : '1/1' }}
                onClick={() => setLbIndex(i)}
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-semibold text-sm truncate">{photo.title}</p>
                    {photo.category_name && <p className="text-white/70 text-xs">{photo.category_name}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 py-16 mb-0">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Присоединяйтесь к нашему сообществу</h2>
          <p className="text-blue-100 mb-8">Зарегистрируйтесь, чтобы получить доступ к полной галерее и новостям школы</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg">
            Зарегистрироваться бесплатно <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {lbIndex !== null && (
        <Lightbox photos={featured} index={lbIndex} onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex(i => Math.max(0, i - 1))}
          onNext={() => setLbIndex(i => Math.min(featured.length - 1, i + 1))}
        />
      )}
    </div>
  )
}
