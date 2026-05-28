import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    // Comprobar si el usuario era previamente un invitado
    const savedGuest = localStorage.getItem('livent_guest') === 'true'
    if (savedGuest) {
      setIsGuest(true)
    }

    const initAuth = async () => {
      try {
        // 1. Obtener sesión inicial
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (session?.user) {
          if (mounted) {
            setUser(session.user)
            setIsGuest(false)
            localStorage.removeItem('livent_guest')
            await fetchProfile(session.user.id)
          }
        } else {
          if (mounted) setLoading(false)
        }
      } catch (err) {
        console.error('Error inicializando auth:', err)
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    // 2. Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event)
      
      if (session?.user) {
        if (mounted) {
          setUser(session.user)
          setIsGuest(false)
          localStorage.removeItem('livent_guest')
          await fetchProfile(session.user.id)
        }
      } else {
        if (mounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Usar maybeSingle para evitar error si no existe el perfil

      if (error) throw error
      
      // Si el usuario existe pero no tiene perfil en la tabla 'profiles'
      if (!data) {
        console.warn('Perfil no encontrado para el usuario:', userId)
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error al obtener el perfil:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    signUp: async ({ email, password, username, fullName, role = 'user' }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            role
          }
        }
      })
      return { data, error }
    },

    signIn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    },

    signOut: async () => {
      await supabase.auth.signOut()
      setIsGuest(false)
      localStorage.removeItem('livent_guest')
    },

    continueAsGuest: () => {
      setIsGuest(true)
      localStorage.setItem('livent_guest', 'true')
    },

    user,
    profile,
    isGuest,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
