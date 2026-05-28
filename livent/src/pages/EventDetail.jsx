import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Calendar, MapPin, ArrowLeft, Heart, Share2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isGuest } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    fetchEvent()
    if (user) checkFavorite()
  }, [id, user])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error.message)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_id', id)
      .maybeSingle()
    
    setIsFavorite(!!data)
  }

  const toggleFavorite = async () => {
    if (isGuest) {
      setShowLoginPrompt(true)
      return
    }
    
    if (!user) return
    
    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', id)
    } else {
      await supabase
        .from('favorites')
        .insert([{ user_id: user.id, event_id: id }])
    }
    setIsFavorite(!isFavorite)
  }

  const handleBooking = () => {
    if (isGuest) {
      setShowLoginPrompt(true)
      return
    }
    // Booking logic for real users...
    alert('Función de reserva próximamente.')
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (!event) return null

  return (
    <div className="bg-white min-h-screen">
      {/* Header Image */}
      <div className="relative h-72 bg-gray-200">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-md z-10"
        >
          <ArrowLeft size={20} />
        </button>
        
        {event.poster_url ? (
          <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
        )}

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            onClick={toggleFavorite}
            className="p-3 bg-white/80 backdrop-blur rounded-full shadow-md transition-transform active:scale-90"
          >
            <Heart size={20} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'} />
          </button>
          <button className="p-3 bg-white/80 backdrop-blur rounded-full shadow-md">
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {showLoginPrompt && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-blue-500" size={20} />
              <p className="text-sm text-blue-700 font-medium">
                Debes iniciar sesión para realizar esta acción.
              </p>
            </div>
            <button 
              onClick={() => navigate('/auth')}
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg w-max font-bold hover:bg-blue-700 transition-colors"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-xl text-blue-600 font-medium">{event.artist}</p>
        </div>

        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="text-blue-500" size={20} />
            <div>
              <p className="text-sm font-bold">
                {new Date(event.starts_at).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(event.starts_at).toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="text-blue-500" size={20} />
            <div>
              <p className="text-sm font-bold">{event.location}</p>
              <p className="text-xs text-gray-500">Ver en el mapa</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Sobre este evento</h2>
          <p className="text-gray-600 leading-relaxed">
            {event.description || 'No hay descripción disponible para este evento.'}
          </p>
        </div>

        <div className="pt-6">
          <button 
            onClick={handleBooking}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors active:scale-95"
          >
            Reservar Entradas
          </button>
        </div>
      </div>
    </div>
  )
}
