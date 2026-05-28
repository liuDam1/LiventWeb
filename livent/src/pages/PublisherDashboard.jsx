import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Plus, Calendar, MapPin, Edit2, Trash2, TrendingUp, Zap, ShieldCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PaymentModal from '../components/PaymentModal'
import CreateEventModal from '../components/CreateEventModal'
import { Elements } from '@stripe/react-stripe-js'
import stripePromise from '../lib/stripe'

export default function PublisherDashboard() {
  const { t } = useTranslation()
  const { user, profile } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [paymentType, setPaymentType] = useState('premium') // 'premium' o 'boost'
  const [selectedEventId, setSelectedEventId] = useState(null)

  const isPremium = profile?.subscription_tier === 'premium'

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
      console.error('Error al obtener mis eventos:', error.message)
      toast.error(t('error_loading_events', 'Error al cargar tus eventos'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = () => {
    const activeEvents = events.filter(e => e.status === 'active').length
    
    if (!isPremium && activeEvents >= 1) {
      setPaymentType('premium')
      setIsPaymentModalOpen(true)
      toast.error(t('limit_reached'))
      return
    }

    setIsCreateModalOpen(true)
  }

  const handleBoost = (eventId) => {
    setSelectedEventId(eventId)
    setPaymentType('boost')
    setIsPaymentModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm(t('delete_confirm'))) return
    
    const loadingToast = toast.loading(t('processing'))
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEvents(events.filter(e => e.id !== id))
      toast.success(t('delete_success'), { id: loadingToast })
    } catch (error) {
      toast.error('Error: ' + error.message, { id: loadingToast })
    }
  }

  if (loading) return <div className="p-8 text-center">{t('loading')}</div>

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('my_events')}</h2>
        <div className="flex items-center gap-2">
          {!isPremium && (
            <button 
              onClick={() => { setPaymentType('premium'); setIsPaymentModalOpen(true); }}
              className="text-xs bg-blue-100 text-blue-600 px-3 py-2 rounded-full font-bold hover:bg-blue-200 transition-colors"
            >
              {t('go_premium')}
            </button>
          )}
          <button 
            onClick={handleCreateEvent}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="p-4 bg-green-100 rounded-xl text-green-600">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('active_events')}</p>
            <p className="text-3xl font-bold">{events.filter(e => e.status === 'active').length}</p>
          </div>
        </div>
        
        {isPremium && (
          <div className="bg-blue-600 rounded-2xl p-6 shadow-lg text-white flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-xl">
              {ShieldCheck ? <ShieldCheck size={32} /> : <span>✓</span>}
            </div>
            <div>
              <p className="text-sm text-blue-100 font-medium">{t('current_plan')}</p>
              <p className="text-xl font-black uppercase tracking-wider">Premium</p>
            </div>
          </div>
        )}
      </div>

      {/* Lista de eventos */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">{t('no_events_created')}</p>
            <button onClick={handleCreateEvent} className="text-blue-600 font-medium mt-2">{t('create_first_event')}</button>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {event.poster_url && <img src={event.poster_url} className="w-full h-full object-cover" alt={event.title} />}
                  </div>
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.artist}</p>
                    <div className="flex gap-2 mt-1">
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </div>
                      {event.is_featured && (
                        <div className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                          {Zap ? <Zap size={10} /> : <span>⚡</span>} {t('featured')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!event.is_featured && event.status === 'active' && (
                    <button 
                      onClick={() => handleBoost(event.id)}
                      className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                      title={t('boost_event')}
                    >
                      <Zap size={20} />
                    </button>
                  )}
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

      {/* Modal de Pago (Stripe) */}
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <PaymentModal 
            isOpen={isPaymentModalOpen} 
            onClose={() => setIsPaymentModalOpen(false)}
            type={paymentType}
            eventId={selectedEventId}
            onPageRefresh={fetchMyEvents}
          />
        </Elements>
      )}

      {/* Modal de Creación de Eventos */}
      <CreateEventModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchMyEvents}
      />
    </div>
  )
}
