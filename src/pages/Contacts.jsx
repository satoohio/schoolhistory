import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Contacts() {
  const [page, setPage] = useState(null)

  useEffect(() => {
    fetch('/api/pages/contacts').then(r => r.ok ? r.json() : null).then(d => d && setPage(d))
  }, [])

  const info = [
    { icon: MapPin, label: 'Адрес', value: 'г. Москва, ул. Школьная, д. 1' },
    { icon: Phone, label: 'Телефон', value: '+7 (495) 000-00-00' },
    { icon: Mail, label: 'Email', value: 'school@example.ru' },
    { icon: Clock, label: 'Режим работы', value: 'Пн–Пт: 8:00 – 18:00' },
  ]

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gradient-to-br from-teal-700 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-3">Контакты</h1>
          <p className="text-teal-100">Мы всегда рады помочь и ответить на ваши вопросы</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {info.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={20} className="text-teal-700" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
                <p className="text-slate-800 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Написать нам</h2>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Сообщение отправлено!') }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ваше имя</label>
                <input type="text" placeholder="Иван Иванов" required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" placeholder="ivan@example.ru" required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Сообщение</label>
              <textarea rows={4} placeholder="Ваш вопрос..." required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <button type="submit"
              className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-colors text-sm">
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
