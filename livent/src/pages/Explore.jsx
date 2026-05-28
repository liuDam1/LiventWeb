import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EventSkeleton, FeaturedSkeleton } from '../components/Skeletons'
import { useTranslation } from 'react-i18next'

export default function Explore() {
  const { t } = useTranslation()
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      
      // Obtener eventos destacados
      const { data: featured, error: fError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('starts_at', { ascending: true })

      if (fError) throw fError
      setFeaturedEvents(featured)

      // Obtener próximos eventos
      const { data: upcoming, error: uError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'active')
        .order('starts_at', { ascending: true })

      if (uError) throw uError
      setUpcomingEvents(upcoming)

    } catch (error) {
      console.error('Error al cargar eventos:', error.message)
    } finally {
      // Simular un pequeño retraso para apreciar los skeletons
      setTimeout(() => setLoading(false), 800)
    }
  }

  return (
    <div className="p-4 space-y-8">
      {/* Eventos Destacados */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-500" size={20} />
          {t('featured')}
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {loading ? (
            <>
              <FeaturedSkeleton />
              <FeaturedSkeleton />
            </>
          ) : (
            featuredEvents.map(event => (
              <Link 
                key={event.id} 
                to={`/event/${event.id}`}
                className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-md snap-start"
              >
                <div className="h-40 bg-gray-200 relative">
                  {event.poster_url ? (
                    <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                  )}
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {t('featured')}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-lg line-clamp-1">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{event.artist}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Todos los eventos */}
      <section>
        <h2 className="text-xl font-bold mb-4">{t('upcoming')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array(6).fill(0).map((_, i) => <EventSkeleton key={i} />)
          ) : (
            upcomingEvents.map(event => (
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
            ))
          )}
        </div>
      </section>
    </div>
  )
}
