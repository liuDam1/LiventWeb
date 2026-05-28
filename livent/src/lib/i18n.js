import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  es: {
    translation: {
      "explore": "Explorar",
      "favorites": "Favoritos",
      "profile": "Perfil",
      "dashboard": "Panel",
      "featured": "Destacados",
      "upcoming": "Próximos Eventos",
      "no_favorites": "No tienes eventos guardados aún.",
      "loading": "Cargando...",
      "sign_in": "Iniciar Sesión",
      "sign_out": "Cerrar Sesión",
      "register": "Registrarse",
      "guest_mode": "Continuar como invitado",
      "password_req": "Requisitos de seguridad",
      "min_8_char": "Mínimo 8 caracteres",
      "at_least_num": "Al menos un número",
      "at_least_spec": "Al menos un carácter especial",
      "book_tickets": "Reservar Entradas"
    }
  },
  en: {
    translation: {
      "explore": "Explore",
      "favorites": "Favorites",
      "profile": "Profile",
      "dashboard": "Dashboard",
      "featured": "Featured",
      "upcoming": "Upcoming Events",
      "no_favorites": "You don't have saved events yet.",
      "loading": "Loading...",
      "sign_in": "Sign In",
      "sign_out": "Sign Out",
      "register": "Register",
      "guest_mode": "Continue as Guest",
      "password_req": "Security requirements",
      "min_8_char": "At least 8 characters",
      "at_least_num": "At least one number",
      "at_least_spec": "At least one special character",
      "book_tickets": "Book Tickets"
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
