import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Comprobar si el usuario era previamente un invitado
    const savedGuest = localStorage.getItem('livent_guest') === 'true'
    if (savedGuest) {
      setIsGuest(true)
    }

    // Comprobar sesiones activas y establecer el usuario
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setIsGuest(false)
        localStorage.removeItem('livent_guest')
        fetchProfile(session.user.id)
      } else if (!savedGuest) {
        setLoading(false)
      } else {
        setLoading(false)
      }
    })

    // Escuchar cambios en el estado de autenticación (inicio de sesión, cierre, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setIsGuest(false)
        localStorage.removeItem('livent_guest')
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
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
