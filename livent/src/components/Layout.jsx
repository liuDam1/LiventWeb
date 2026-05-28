import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Heart, User, LayoutDashboard, LogOut, LogIn, Languages } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'

export default function Layout({ children }) {
  const { t, i18n } = useTranslation()
  const { user, profile, isGuest, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success(t('sign_out'))
    navigate('/auth')
  }

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('es') ? 'en' : 'es'
    i18n.changeLanguage(newLang)
    toast.success(newLang === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English', {
      icon: '🌍',
    })
  }

  const navItems = [
    { icon: Home, label: t('explore'), path: '/' },
    { icon: Heart, label: t('favorites'), path: '/favorites' },
    { icon: User, label: t('profile'), path: '/profile' },
  ]

  // Añadir el Panel de Publisher si el usuario es un organizador
  if (profile?.role === 'publisher') {
    navItems.splice(2, 0, { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra Superior */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-600">Livent</h1>
          <button 
            onClick={toggleLanguage}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 rounded-full"
            title="Cambiar idioma"
          >
            <Languages size={20} />
          </button>
        </div>
        
        {isGuest ? (
          <Link 
            to="/auth" 
            className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            <LogIn size={18} />
            <span>{t('sign_in')}</span>
          </Link>
        ) : (
          <button 
            onClick={handleSignOut}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title={t('sign_out')}
          >
            <LogOut size={20} />
          </button>
        )}
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Navegación Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 px-4 z-10">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
