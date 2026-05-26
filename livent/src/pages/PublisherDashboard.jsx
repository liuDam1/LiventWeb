import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Plus, Calendar, MapPin, Edit2, Trash2, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PublisherDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchMyEvents()
  }, [user])

  const fetchMyEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('publisher_id', user.id)
        .order('starts_at', { ascending: false })

      if (error) throw error
      setEvents(data)
    } catch (error) {
      console.error('Error fetching my events:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEvents(events.filter(e => e.id !== id))
    } catch (error) {
      alert('Error al eliminar: ' + error.message)
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Eventos</h2>
        <button className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
          <Plus size={24} />
        </button>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
        <div className="p-4 bg-green-100 rounded-xl text-green-600">
          <TrendingUp size={32} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Eventos Activos</p>
          <p className="text-3xl font-bold">{events.filter(e => e.status === 'active').length}</p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">Aún no has creado ningún evento.</p>
            <button className="text-blue-600 font-medium mt-2">Crear mi primer evento</button>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {event.poster_url && <img src={event.poster_url} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.artist}</p>
                    <div className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(event.starts_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span className="truncate max-w-[150px]">{event.location}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
