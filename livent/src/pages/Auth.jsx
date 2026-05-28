import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Briefcase, AlertCircle, ArrowRight, Check, X, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    role: 'user'
  })
  
  const { signIn, signUp, continueAsGuest } = useAuth()
  const navigate = useNavigate()

  // Criterios de validación de contraseña
  const passwordCriteria = {
    length: formData.password.length >= 8,
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  }

  const isPasswordStrong = passwordCriteria.length && passwordCriteria.number && passwordCriteria.special

  const mapAuthError = (err) => {
    const message = err.message || ''
    if (message.includes('Invalid login credentials')) return 'Email o contraseña incorrectos. Revisa tus datos.'
    if (message.includes('User already registered')) return 'Este correo electrónico ya está registrado. Prueba a iniciar sesión.'
    if (message.includes('Email not confirmed')) return 'Por favor, confirma tu correo electrónico para poder entrar.'
    if (message.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.'
    if (message.includes('rate limit')) return 'Demasiados intentos. Por favor, espera un momento.'
    return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isLogin && !isPasswordStrong) {
      setError('La contraseña no cumple con los requisitos de seguridad.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error: signInError } = await signIn({
          email: formData.email,
          password: formData.password
        })
        if (signInError) throw signInError
        toast.success('¡Bienvenido de nuevo!')
      } else {
        const { error: signUpError } = await signUp({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          fullName: formData.fullName,
          role: formData.role
        })
        if (signUpError) throw signUpError
        toast.success('¡Registro exitoso! Revisa tu correo.', { duration: 5000 })
      }
      navigate('/')
    } catch (err) {
      setError(mapAuthError(err))
      toast.error(mapAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGuestMode = () => {
    continueAsGuest()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-blue-600 mb-2">Livent</h1>
        <h2 className="text-center text-xl text-gray-600">
          {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea una cuenta nueva'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center gap-3 rounded-md">
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="usuario123"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Juan Pérez"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de cuenta</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="text-gray-400" size={18} />
                    </div>
                    <select
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="user">Usuario (Explorar eventos)</option>
                      <option value="publisher">Publisher (Crear eventos)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {!isLogin && (
                <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Requisitos de seguridad:</p>
                  <div className="grid grid-cols-1 gap-1">
                    <div className={`flex items-center gap-2 text-xs ${passwordCriteria.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordCriteria.length ? <Check size={12} /> : <X size={12} />}
                      Mínimo 8 caracteres
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordCriteria.number ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordCriteria.number ? <Check size={12} /> : <X size={12} />}
                      Al menos un número
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordCriteria.special ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordCriteria.special ? <Check size={12} /> : <X size={12} />}
                      Al menos un carácter especial (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || (!isLogin && !isPasswordStrong)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-4 items-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
            
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">O también</span></div>
            </div>

            <button
              onClick={handleGuestMode}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Continuar como invitado <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
