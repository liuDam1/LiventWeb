import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Heart, User, LayoutDashboard, LogOut, LogIn, Languages, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useState, useRef, useEffect } from 'react'

export default function Layout({ children }) {
  const { t, i18n } = useTranslation()
  const { user, profile, isGuest, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const langMenuRef = useRef(null)

  // Cerrar el menú de idiomas al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false)
      }
    }
    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isLangMenuOpen])

  const handleSignOut = async () => {
    await signOut()
    toast.success(t('sign_out'))
    navigate('/auth')
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setIsLangMenuOpen(false)
    
    const messages = {
      es: 'Idioma cambiado a Español',
      en: 'Language changed to English',
      zh: '语言已更改为中文'
    }
    
    toast.success(messages[lng], {
      icon: '🌍',
    })
  }

  const languages = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
  ]

  // Definir items de navegación basados en el rol
  const navItems = [
    { icon: Home, label: t('explore'), path: '/' },
  ]

  // Solo los usuarios normales (no publishers) e invitados tienen favoritos
  if (profile?.role !== 'publisher') {
    navItems.push({ icon: Heart, label: t('favorites'), path: '/favorites' })
  }

  // Panel de Publisher si el usuario es un organizador
  if (profile?.role === 'publisher') {
    navItems.push({ icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' })
  }

  // Perfil siempre visible para usuarios logueados
  if (user) {
    navItems.push({ icon: User, label: t('profile'), path: '/profile' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra Superior */}
      <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-600">Livent</h1>
          
          {/* Selector de Idioma Desplegable */}
          <div className="relative" ref={langMenuRef}>
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 rounded-full flex items-center gap-1 border border-gray-100"
            >
              <Languages size={18} />
              <span className="text-[10px] font-bold uppercase">{i18n.language.split('-')[0]}</span>
              <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in duration-150">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                      i18n.language.startsWith(lang.code) ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-gray-600'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
