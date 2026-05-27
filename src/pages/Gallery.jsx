import { useState, useEffect } from 'react'
import { Search, Filter, Images } from 'lucide-react'
import Lightbox from '../components/Lightbox'

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [lbIndex, setLbIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/photos/categories').then(r => r.json()).then(data => Array.isArray(data) && setCategories(data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (activeCategory !== 'all') params.set('category', activeCategory)
    fetch(`/api/photos?${params}`)
      .then(r => r.json())
      .then(data => { Array.isArray(data) ? setPhotos(data) : setPhotos([]) })
      .finally(() => setLoading(false))
  }, [activeCategory])

  const filtered = photos.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Images size={24} />
          </div>
          <h1 className="text-4xl font-bold mb-2">Фотогалерея</h1>
          <p className="text-slate-400">Яркие моменты жизни нашей школы</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Поиск по названию..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-slate-400" />
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
            >Все</button>
            {categories.map(c => (
              <button key={c.slug}
                onClick={() => setActiveCategory(c.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === c.slug ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
              >{c.name} {c.photo_count > 0 && <span className="opacity-60 text-xs ml-1">({c.photo_count})</span>}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Images size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Фотографий пока нет</p>
            <p className="text-slate-400 text-sm mt-1">Попробуйте изменить фильтр или поисковый запрос</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4">{filtered.length} фотографий</p>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((photo, i) => (
                <div key={photo.id}
                  className="break-inside-avoid overflow-hidden rounded-2xl cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 relative"
                  onClick={() => setLbIndex(i)}
                >
                  <img src={photo.url} alt={photo.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-medium text-sm truncate">{photo.title}</p>
                      {photo.category_name && <p className="text-white/70 text-xs">{photo.category_name}</p>}
                    </div>
                  </div>
                  {photo.is_featured && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">★</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {lbIndex !== null && (
        <Lightbox photos={filtered} index={lbIndex} onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex(i => Math.max(0, i - 1))}
          onNext={() => setLbIndex(i => Math.min(filtered.length - 1, i + 1))}
        />
      )}
    </div>
  )
}
