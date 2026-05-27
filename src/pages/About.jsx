import { useState, useEffect } from 'react'
import { BookOpen, Award, Users, Heart } from 'lucide-react'

export default function About() {
  const [page, setPage] = useState(null)

  useEffect(() => {
    fetch('/api/pages/about').then(r => r.ok ? r.json() : null).then(d => d && setPage(d))
  }, [])

  const values = [
    { icon: BookOpen, title: 'Знания', desc: 'Глубокое образование по всем предметам с упором на критическое мышление.' },
    { icon: Users, title: 'Команда', desc: 'Дружный коллектив учителей и учеников, работающих вместе.' },
    { icon: Award, title: 'Достижения', desc: 'Победители олимпиад, конкурсов и спортивных соревнований.' },
    { icon: Heart, title: 'Забота', desc: 'Индивидуальный подход к каждому ребёнку.' },
  ]

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gradient-to-br from-indigo-800 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-3">О нашей школе</h1>
          <p className="text-blue-200 text-lg">Более 70 лет качественного образования</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {/* Main text */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-10 border border-slate-100">
          <div className="prose prose-slate max-w-none">
            {page ? (
              page.content.split('\n').map((line, i) => (
                <p key={i} className="text-slate-600 leading-relaxed mb-4 last:mb-0 text-lg">{line}</p>
              ))
            ) : (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-5 bg-slate-100 rounded animate-pulse" />)}
              </div>
            )}
          </div>
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Наши ценности</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={20} className="text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
