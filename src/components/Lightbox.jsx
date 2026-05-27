import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index]

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!photo) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition">
        <X size={24} />
      </button>
      {index > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 p-3 text-white/80 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition">
          <ChevronLeft size={28} />
        </button>
      )}
      {index < photos.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 p-3 text-white/80 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition">
          <ChevronRight size={28} />
        </button>
      )}
      <div className="max-w-5xl max-h-[90vh] w-full mx-16 flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <img
          src={photo.url}
          alt={photo.title}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
        />
        <div className="mt-4 text-center">
          <h3 className="text-white font-semibold text-lg">{photo.title}</h3>
          {photo.description && <p className="text-slate-400 text-sm mt-1">{photo.description}</p>}
          {photo.category_name && (
            <span className="inline-block mt-2 px-3 py-1 bg-blue-700/50 text-blue-200 text-xs rounded-full">{photo.category_name}</span>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 text-slate-400 text-sm">{index + 1} / {photos.length}</div>
    </div>
  )
}
