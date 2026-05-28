import { useState, useEffect } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { X, ShieldCheck, Zap, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

export default function PaymentModal({ isOpen, onClose, type, eventId, onPageRefresh }) {
  const { t, i18n } = useTranslation()
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isPremium = type === 'premium'
  const price = isPremium ? '9,99 €' : '2,99 €'

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const toastId = toast.loading(t('processing_payment', 'Procesando pago...'))

    try {
      // Simulación de éxito para el flujo de la UI
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success(t('payment_success', '¡Pago realizado con éxito!'), { id: toastId })
      
      // Refrescar perfil o eventos en la UI
      if (onPageRefresh) onPageRefresh()
      onClose()

    } catch (err) {
      console.error('Error en el pago:', err)
      setError(err.message)
      toast.error(err.message, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  // Mapear el código de idioma de i18next al formato que espera Stripe
  const getStripeLocale = () => {
    try {
      const lang = i18n.language?.split('-')[0] || 'es'
      if (['zh', 'en', 'es', 'fr', 'de', 'it', 'ja'].includes(lang)) return lang
      return 'es'
    } catch (e) {
      return 'es'
    }
  }

  // Verificar si las dependencias de Stripe están listas
  const isStripeReady = stripe && elements

  // Renderizado seguro de iconos
  const IconHeader = isPremium ? ShieldCheck : Zap

  // Si stripe no está listo pero el modal está abierto, mostrar cargando dentro del modal
  // para evitar que CardElement se renderice sin contexto
  const isReady = stripe && elements

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="p-6 border-b relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {X ? <X size={24} /> : <span className="text-2xl">×</span>}
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isPremium ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
              {IconHeader ? <IconHeader size={28} /> : <span>{isPremium ? '★' : '⚡'}</span>}
            </div>
            <div>
              <h3 className="text-xl font-bold">{isPremium ? 'Livent Premium' : 'Event Boost'}</h3>
              <p className="text-sm text-gray-500">{isPremium ? t('monthly_sub', 'Suscripción mensual') : t('one_time', 'Pago único')}</p>
            </div>
          </div>
        </div>

        {/* Cuerpo */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
            <span className="font-medium text-gray-600">{t('total_to_pay', 'Total a pagar')}:</span>
            <span className="text-2xl font-black text-gray-900">{price}</span>
          </div>

          {!isReady ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500">{t('loading', 'Cargando...')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                {t('card_details', 'Detalles de la tarjeta')}
              </label>
              <div className="p-4 border rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <CardElement options={{
                  locale: getStripeLocale(),
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1f2937',
                      '::placeholder': { color: '#9ca3af' },
                    },
                  },
                }} />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  {AlertCircle ? <AlertCircle size={16} /> : <span>⚠️</span>}
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          <div className="text-center text-xs text-gray-400">
            {t('stripe_secure', 'Pago seguro procesado por Stripe. Al pagar aceptas nuestros términos.')}
          </div>

          <button
            type="submit"
            disabled={!isReady || loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
              isPremium ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {loading ? t('processing', 'Procesando...') : `${t('pay_now', 'Pagar ahora')} ${price}`}
          </button>
        </form>
      </div>
    </div>
  )
}
