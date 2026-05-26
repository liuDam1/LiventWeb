import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar, MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          event_id,
          event:events (*)
        `)
        .eq('user_id', user.id)

      if (error) throw error
      setFavorites(data.map(f => f.event).filter(Boolean))
    } catch (error) {
      console.error('Error fetching favorites:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="text-red-500 fill-red-500" size={24} />
        Mis Favoritos
      </h2>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
          <Heart className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No tienes eventos guardados aún.</p>
          <Link to="/" className="text-blue-600 font-medium mt-2 inline-block">
            Explorar eventos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map(event => (
            <Link 
              key={event.id} 
              to={`/event/${event.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm border flex h-32"
            >
              <div className="w-32 bg-gray-200 shrink-0">
                {event.poster_url ? (
                  <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin imagen</div>
                )}
              </div>
              <div className="p-3 flex flex-col justify-between overflow-hidden">
                <div>
                  <h3 className="font-bold line-clamp-1">{event.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-1">{event.artist}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar size={12} />
                    <span>{new Date(event.starts_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <MapPin size={12} />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
