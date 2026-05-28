import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Heart, User, LayoutDashboard, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, profile, isGuest, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const navItems = [
    { icon: Home, label: 'Explorar', path: '/' },
    { icon: Heart, label: 'Favoritos', path: '/favorites' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ]

  // Add Publisher Dashboard if user is a publisher
  if (profile?.role === 'publisher') {
    navItems.splice(2, 0, { icon: LayoutDashboard, label: 'Panel', path: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Livent</h1>
        {isGuest ? (
          <Link 
            to="/auth" 
            className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            <LogIn size={18} />
            <span>Iniciar Sesión</span>
          </Link>
        ) : (
          <button 
            onClick={handleSignOut}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
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
