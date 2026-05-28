import { useAuth } from '../context/AuthContext'
import { User, Mail, Shield, Star, CreditCard, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import PaymentModal from '../components/PaymentModal'
import { Elements } from '@stripe/react-stripe-js'
import stripePromise from '../lib/stripe'
import { useTranslation } from 'react-i18next'

export default function Profile() {
  const { t } = useTranslation()
  const { profile, user, signOut } = useAuth()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  if (!profile) return (
    <div className="p-8 text-center text-gray-500">
      {t('loading_profile')}
    </div>
  )

  const stats = [
    { label: t('attended_events'), value: '12', icon: Star },
    { label: t('favorites'), value: '5', icon: Shield },
  ]

  const isPremium = profile.subscription_tier === 'premium'

  return (
    <div className="p-4 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 relative">
          <User size={48} />
          {isPremium && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <ShieldCheck className="text-blue-600" size={24} />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold">{profile.full_name || profile.username}</h2>
        <p className="text-gray-500">@{profile.username}</p>
        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isPremium ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isPremium ? 'Premium' : profile.role === 'publisher' ? 'Publisher' : 'Usuario'}
        </div>
      </div>

      {/* Tarjeta de Información */}
      <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="text-gray-400" size={20} />
          <div>
            <p className="text-xs text-gray-500">{t('email_label')}</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="text-gray-400" size={20} />
          <div>
            <p className="text-xs text-gray-500">{t('plan_label')}</p>
            <p className="font-medium capitalize">
              {isPremium ? t('premium_plan') : t('free_plan')}
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <Icon className="mx-auto text-blue-600 mb-2" size={24} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Llamada a la acción de suscripción */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">{t('upgrade_premium')}</h3>
            <p className="text-blue-100 text-sm mb-4">
              {t('upgrade_desc')}
            </p>
            <button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-md active:scale-95"
            >
              {t('view_plans')} (9,99 €/mes)
            </button>
          </div>
          <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
        </div>
      )}

      {/* Cerrar Sesión */}
      <button 
        onClick={signOut}
        className="w-full bg-white text-red-600 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
      >
        {t('sign_out')}
      </button>

      {/* Modal de Pago */}
      <Elements stripe={stripePromise}>
        <PaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)}
          type="premium"
        />
      </Elements>
    </div>
  )
}
