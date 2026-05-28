import { useAuth } from '../context/AuthContext'
import { User, Mail, Shield, Star, CreditCard } from 'lucide-react'

export default function Profile() {
  const { profile, user, signOut } = useAuth()

  if (!profile) return (
    <div className="p-8 text-center text-gray-500">
      Cargando perfil...
    </div>
  )

  const stats = [
    { label: 'Eventos Asistidos', value: '12', icon: Star },
    { label: 'Favoritos', value: '5', icon: Shield },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <User size={48} />
        </div>
        <h2 className="text-2xl font-bold">{profile.full_name || profile.username}</h2>
        <p className="text-gray-500">@{profile.username}</p>
        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {profile.role === 'publisher' ? 'Publisher' : 'Usuario'}
        </div>
      </div>

      {/* Tarjeta de Información */}
      <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="text-gray-400" size={20} />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="text-gray-400" size={20} />
          <div>
            <p className="text-xs text-gray-500">Plan</p>
            <p className="font-medium capitalize">{profile.subscription_tier || 'Gratuito'}</p>
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
      {profile.subscription_tier !== 'premium' && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-2">Pásate a Premium</h3>
          <p className="text-blue-100 text-sm mb-4">
            Desbloquea eventos exclusivos y gestiona tus propias publicaciones sin límites.
          </p>
          <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Ver Planes
          </button>
        </div>
      )}

      {/* Cerrar Sesión */}
      <button 
        onClick={signOut}
        className="w-full bg-white text-red-600 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}
