import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Upload, Trash2, Users, Images, LayoutGrid, FileText, Plus, X, Star, StarOff, Settings } from 'lucide-react'

function TabBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
        ${active ? 'bg-blue-700 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
      <Icon size={15} />{children}
    </button>
  )
}

export default function Admin() {
  const { user, isAdmin, authFetch } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('photos')
  const [stats, setStats] = useState(null)
  const [photos, setPhotos] = useState([])
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [pages, setPages] = useState({})
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', category_id: '', is_featured: false })
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [newCat, setNewCat] = useState({ name: '', slug: '' })
  const [msg, setMsg] = useState('')
  const [editPage, setEditPage] = useState({ about: null, contacts: null })
  const fileRef = useRef()

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    loadAll()
  }, [isAdmin])

  async function loadAll() {
    const [statsR, photosR, usersR, catsR] = await Promise.all([
      authFetch('/api/admin/stats').then(r => r.json()),
      authFetch('/api/photos?limit=100').then(r => r.json()),
      authFetch('/api/admin/users').then(r => r.json()),
      authFetch('/api/photos/categories').then(r => r.json()),
    ])
    setStats(statsR)
    setPhotos(Array.isArray(photosR) ? photosR : [])
    setUsers(Array.isArray(usersR) ? usersR : [])
    setCategories(Array.isArray(catsR) ? catsR : [])

    const [aboutR, contactsR] = await Promise.all([
      fetch('/api/pages/about').then(r => r.ok ? r.json() : null),
      fetch('/api/pages/contacts').then(r => r.ok ? r.json() : null),
    ])
    setEditPage({ about: aboutR, contacts: contactsR })
  }

  function showMsg(text) { setMsg(text); setTimeout(() => setMsg(''), 3000) }

  async function handleUpload(e) {
    e.preventDefault()
    if (!selectedFile) { showMsg('Выберите файл'); return }
    if (!uploadForm.title) { showMsg('Введите название'); return }
    setUploading(true)
    const fd = new FormData()
    fd.append('photo', selectedFile)
    fd.append('title', uploadForm.title)
    fd.append('description', uploadForm.description)
    fd.append('category_id', uploadForm.category_id)
    fd.append('is_featured', uploadForm.is_featured)
    const res = await authFetch('/api/photos', { method: 'POST', body: fd })
    if (res.ok) {
      const p = await res.json()
      setPhotos(prev => [p, ...prev])
      setUploadForm({ title: '', description: '', category_id: '', is_featured: false })
      setSelectedFile(null); setPreview(null)
      showMsg('Фото успешно добавлено!')
    } else {
      const d = await res.json(); showMsg(d.error || 'Ошибка загрузки')
    }
    setUploading(false)
  }

  async function deletePhoto(id) {
    if (!confirm('Удалить фото?')) return
    const res = await authFetch(`/api/photos/${id}`, { method: 'DELETE' })
    if (res.ok) { setPhotos(prev => prev.filter(p => p.id !== id)); showMsg('Фото удалено') }
  }

  async function toggleFeatured(photo) {
    const res = await authFetch(`/api/photos/${photo.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...photo, is_featured: !photo.is_featured })
    })
    if (res.ok) { const p = await res.json(); setPhotos(prev => prev.map(x => x.id === p.id ? p : x)) }
  }

  async function changeRole(userId, role) {
    const res = await authFetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    })
    if (res.ok) { const u = await res.json(); setUsers(prev => prev.map(x => x.id === u.id ? u : x)); showMsg('Роль изменена') }
  }

  async function addCategory() {
    if (!newCat.name || !newCat.slug) { showMsg('Заполните все поля'); return }
    const res = await authFetch('/api/admin/categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat)
    })
    if (res.ok) { const c = await res.json(); setCategories(prev => [...prev, c]); setNewCat({ name: '', slug: '' }); showMsg('Категория добавлена') }
    else { const d = await res.json(); showMsg(d.error) }
  }

  async function deleteCategory(id) {
    if (!confirm('Удалить категорию?')) return
    const res = await authFetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) { setCategories(prev => prev.filter(c => c.id !== id)); showMsg('Удалено') }
  }

  async function savePage(slug) {
    const p = editPage[slug]
    const res = await authFetch(`/api/pages/${slug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: p.title, content: p.content })
    })
    if (res.ok) showMsg('Сохранено!')
    else showMsg('Ошибка сохранения')
  }

  if (!isAdmin) return null

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Панель администратора</h1>
            <p className="text-slate-400 text-sm">Привет, {user?.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Msg */}
        {msg && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">{msg}</div>}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[['Пользователей', stats.users, Users], ['Фотографий', stats.photos, Images], ['Категорий', stats.categories, LayoutGrid]].map(([label, val, Icon]) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
                <Icon size={20} className="text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{val}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <TabBtn active={tab === 'photos'} onClick={() => setTab('photos')} icon={Images}>Фотографии</TabBtn>
          <TabBtn active={tab === 'upload'} onClick={() => setTab('upload')} icon={Upload}>Загрузить</TabBtn>
          <TabBtn active={tab === 'categories'} onClick={() => setTab('categories')} icon={LayoutGrid}>Категории</TabBtn>
          <TabBtn active={tab === 'users'} onClick={() => setTab('users')} icon={Users}>Пользователи</TabBtn>
          <TabBtn active={tab === 'pages'} onClick={() => setTab('pages')} icon={FileText}>Страницы</TabBtn>
        </div>

        {/* Photos tab */}
        {tab === 'photos' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Все фотографии ({photos.length})</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
              {photos.map(photo => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-slate-100 aspect-square">
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <button onClick={() => toggleFeatured(photo)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 text-white">
                        {photo.is_featured ? <Star size={14} className="fill-amber-400 text-amber-400" /> : <StarOff size={14} />}
                      </button>
                      <button onClick={() => deletePhoto(photo.id)} className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-600 text-white">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                  </div>
                </div>
              ))}
              {photos.length === 0 && (
                <div className="col-span-4 py-16 text-center text-slate-400">
                  <Images size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Фотографий ещё нет</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload tab */}
        {tab === 'upload' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-800 mb-6">Загрузить фотографию</h2>
            <form onSubmit={handleUpload} className="space-y-5">
              {/* Dropzone */}
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
              >
                {preview ? (
                  <div className="relative inline-block">
                    <img src={preview} alt="preview" className="max-h-48 rounded-xl mx-auto object-cover" />
                    <button type="button" onClick={e => { e.stopPropagation(); setPreview(null); setSelectedFile(null) }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Нажмите или перетащите фото</p>
                    <p className="text-slate-400 text-xs mt-1">JPG, PNG, WebP до 10 МБ</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => {
                    const f = e.target.files[0]
                    if (f) { setSelectedFile(f); setPreview(URL.createObjectURL(f)) }
                  }} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Название *</label>
                  <input type="text" value={uploadForm.title}
                    onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="Название фото" required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Категория</label>
                  <select value={uploadForm.category_id}
                    onChange={e => setUploadForm({ ...uploadForm, category_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Без категории</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Описание</label>
                <textarea rows={2} value={uploadForm.description}
                  onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Краткое описание..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={uploadForm.is_featured}
                  onChange={e => setUploadForm({ ...uploadForm, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500" />
                <span className="text-sm text-slate-700">Показать на главной странице</span>
              </label>
              <button type="submit" disabled={uploading}
                className="w-full py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                <Upload size={16} /> {uploading ? 'Загружаем...' : 'Загрузить фото'}
              </button>
            </form>
          </div>
        )}

        {/* Categories tab */}
        {tab === 'categories' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-800 mb-5">Категории</h2>
            <div className="flex gap-3 mb-6">
              <input type="text" placeholder="Название" value={newCat.name}
                onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="slug (без пробелов)" value={newCat.slug}
                onChange={e => setNewCat({ ...newCat, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={addCategory} className="px-4 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-1">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-medium text-slate-800 text-sm">{c.name}</span>
                    <span className="ml-2 text-slate-400 text-xs">{c.slug}</span>
                    <span className="ml-2 text-blue-600 text-xs font-medium">{c.photo_count} фото</span>
                  </div>
                  <button onClick={() => deleteCategory(c.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Пользователи ({users.length})</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{u.name}</p>
                    <p className="text-slate-400 text-xs">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {u.role === 'admin' ? 'Админ' : 'Пользователь'}
                    </span>
                    {u.id !== user?.id && (
                      <button
                        onClick={() => changeRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                        className="text-xs text-blue-600 hover:underline">
                        {u.role === 'admin' ? 'Разжаловать' : 'Сделать админом'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages tab */}
        {tab === 'pages' && (
          <div className="space-y-6">
            {[['about', 'О школе'], ['contacts', 'Контакты']].map(([slug, title]) => (
              <div key={slug} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-semibold text-slate-800 mb-4">{title}</h2>
                {editPage[slug] ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Заголовок</label>
                      <input type="text" value={editPage[slug].title}
                        onChange={e => setEditPage(prev => ({ ...prev, [slug]: { ...prev[slug], title: e.target.value } }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Текст</label>
                      <textarea rows={6} value={editPage[slug].content}
                        onChange={e => setEditPage(prev => ({ ...prev, [slug]: { ...prev[slug], content: e.target.value } }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <button onClick={() => savePage(slug)}
                      className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-colors text-sm">
                      Сохранить
                    </button>
                  </div>
                ) : <p className="text-slate-400 text-sm">Загрузка...</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
