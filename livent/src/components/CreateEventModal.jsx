import { useState } from 'react'
import { X, Calendar, MapPin, Type, User, AlignLeft, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function CreateEventModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    location: '',
    description: '',
    starts_at: '',
    poster_url: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validación básica
    if (!formData.title || !formData.artist || !formData.location || !formData.starts_at) {
      toast.error(t('fill_all_fields'))
      return
    }

    setLoading(true)
    const toastId = toast.loading(t('processing'))

    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          ...formData,
          publisher_id: user.id,
          status: 'active',
          is_featured: false
        }])

      if (error) throw error

      toast.success(t('event_created_success'), { id: toastId })
      setFormData({
        title: '',
        artist: '',
        location: '',
        description: '',
        starts_at: '',
        poster_url: ''
      })
      onSuccess() // Refrescar la lista de eventos
      onClose()
    } catch (err) {
      console.error('Error al crear evento:', err)
      toast.error(err.message, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="text-xl font-bold text-gray-900">{t('create_event_title')}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario con Scroll */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Type size={16} className="text-blue-500" />
              {t('event_title_label')} *
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Ej: Concierto de Verano"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Artista / Organizador */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              {t('artist_label')} *
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Ej: Banda Local"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            />
          </div>

          {/* Ubicación */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              {t('location_label')} *
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Ej: Madrid, WiZink Center"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              {t('date_label')} *
            </label>
            <input
              type="datetime-local"
              required
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              value={formData.starts_at}
              onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
            />
          </div>

          {/* URL de Imagen */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-500" />
              {t('image_url_label')}
            </label>
            <input
              type="url"
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.poster_url}
              onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <AlignLeft size={16} className="text-blue-500" />
              {t('description_label')}
            </label>
            <textarea
              rows="3"
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
              placeholder="Cuéntanos más sobre el evento..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4 bg-white sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 py-3 px-8 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? t('processing') : t('publish_event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
