import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  es: {
    translation: {
      // Navegación
      "explore": "Explorar",
      "favorites": "Favoritos",
      "profile": "Perfil",
      "dashboard": "Panel",
      "featured": "Destacados",
      "upcoming": "Próximos Eventos",
      "loading": "Cargando...",
      "sign_in": "Iniciar Sesión",
      "sign_out": "Cerrar Sesión",
      "register": "Registrarse",
      "guest_mode": "Continuar como invitado",
      "back": "Volver",
      "save": "Guardar",
      "delete": "Eliminar",
      "edit": "Editar",
      "create": "Crear",

      // Autenticación
      "welcome_back": "¡Bienvenido de nuevo!",
      "login_title": "Inicia sesión en tu cuenta",
      "register_title": "Crea una cuenta nueva",
      "email_label": "Email",
      "password_label": "Contraseña",
      "username_label": "Nombre de usuario",
      "fullname_label": "Nombre completo",
      "account_type": "Tipo de cuenta",
      "user_role": "Usuario (Explorar eventos)",
      "publisher_role": "Publisher (Crear eventos)",
      "no_account": "¿No tienes cuenta? Regístrate",
      "have_account": "¿Ya tienes cuenta? Inicia sesión",
      "or_also": "O también",
      "password_req": "Requisitos de seguridad",
      "min_8_char": "Mínimo 8 caracteres",
      "at_least_num": "Al menos un número",
      "at_least_spec": "Al menos un carácter especial",
      "processing": "Procesando...",

      // Detalle de Evento
      "about_event": "Sobre este evento",
      "book_tickets": "Reservar Entradas",
      "no_description": "No hay descripción disponible para este evento.",
      "view_on_map": "Ver en el mapa",
      "login_to_favorite": "Inicia sesión para guardar favoritos",
      "login_to_book": "Inicia sesión para reservar",
      "added_to_favorites": "Añadido a favoritos",
      "removed_from_favorites": "Eliminado de favoritos",

      // Perfil
      "attended_events": "Eventos Asistidos",
      "plan_label": "Plan",
      "free_plan": "Gratuito",
      "premium_plan": "Premium",
      "upgrade_premium": "Pásate a Premium",
      "upgrade_desc": "Desbloquea eventos exclusivos y gestiona tus propias publicaciones sin límites.",
      "view_plans": "Ver Planes",
      "loading_profile": "Cargando perfil...",

      // Dashboard
      "my_events": "Mis Eventos",
      "active_events": "Eventos Activos",
      "no_events_created": "Aún no has creado ningún evento.",
      "create_first_event": "Crear mi primer evento",
      "delete_confirm": "¿Estás seguro de que quieres eliminar este evento?",
      "delete_success": "Evento eliminado correctamente",
      "coming_soon": "Función próximamente",

      // Favoritos
      "no_favorites": "No tienes eventos guardados aún.",
      "explore_events": "Explorar eventos"
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
      "loading": "Loading...",
      "sign_in": "Sign In",
      "sign_out": "Sign Out",
      "register": "Register",
      "guest_mode": "Continue as Guest",
      "back": "Back",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "create": "Create",

      "welcome_back": "Welcome back!",
      "login_title": "Sign in to your account",
      "register_title": "Create a new account",
      "email_label": "Email",
      "password_label": "Password",
      "username_label": "Username",
      "fullname_label": "Full Name",
      "account_type": "Account Type",
      "user_role": "User (Explore events)",
      "publisher_role": "Publisher (Create events)",
      "no_account": "Don't have an account? Register",
      "have_account": "Already have an account? Sign In",
      "or_also": "Or also",
      "password_req": "Security requirements",
      "min_8_char": "At least 8 characters",
      "at_least_num": "At least one number",
      "at_least_spec": "At least one special character",
      "processing": "Processing...",

      "about_event": "About this event",
      "book_tickets": "Book Tickets",
      "no_description": "No description available for this event.",
      "view_on_map": "View on map",
      "login_to_favorite": "Log in to save favorites",
      "login_to_book": "Log in to book",
      "added_to_favorites": "Added to favorites",
      "removed_from_favorites": "Removed from favorites",

      "attended_events": "Attended Events",
      "plan_label": "Plan",
      "free_plan": "Free",
      "premium_plan": "Premium",
      "upgrade_premium": "Go Premium",
      "upgrade_desc": "Unlock exclusive events and manage your own posts without limits.",
      "view_plans": "View Plans",
      "loading_profile": "Loading profile...",

      "my_events": "My Events",
      "active_events": "Active Events",
      "no_events_created": "You haven't created any events yet.",
      "create_first_event": "Create my first event",
      "delete_confirm": "Are you sure you want to delete this event?",
      "delete_success": "Event deleted successfully",
      "coming_soon": "Feature coming soon",

      "no_favorites": "You don't have saved events yet.",
      "explore_events": "Explore events"
    }
  },
  zh: {
    translation: {
      "explore": "探索",
      "favorites": "收藏",
      "profile": "个人资料",
      "dashboard": "控制面板",
      "featured": "精选活动",
      "upcoming": "即将举行的活动",
      "loading": "加载中...",
      "sign_in": "登录",
      "sign_out": "退出登录",
      "register": "注册",
      "guest_mode": "以访客身份继续",
      "back": "返回",
      "save": "保存",
      "delete": "删除",
      "edit": "编辑",
      "create": "创建",

      "welcome_back": "欢迎回来！",
      "login_title": "登录您的帐户",
      "register_title": "创建新帐户",
      "email_label": "电子邮件",
      "password_label": "密码",
      "username_label": "用户名",
      "fullname_label": "姓名",
      "account_type": "帐户类型",
      "user_role": "用户（探索活动）",
      "publisher_role": "发布者（创建活动）",
      "no_account": "没有帐户？注册",
      "have_account": "已有帐户？登录",
      "or_also": "或者",
      "password_req": "安全要求",
      "min_8_char": "至少 8 个字符",
      "at_least_num": "至少包含一个数字",
      "at_least_spec": "至少包含一个特殊字符",
      "processing": "处理中...",

      "about_event": "关于此活动",
      "book_tickets": "预订门票",
      "no_description": "此活动暂无说明。",
      "view_on_map": "在地图上查看",
      "login_to_favorite": "登录以保存收藏",
      "login_to_book": "登录以预订",
      "added_to_favorites": "已加入收藏",
      "removed_from_favorites": "已从收藏中移除",

      "attended_events": "参加的活动",
      "plan_label": "计划",
      "free_plan": "免费",
      "premium_plan": "高级",
      "upgrade_premium": "升级到高级版",
      "upgrade_desc": "解锁专属活动，无限制管理您发布的活动。",
      "view_plans": "查看计划",
      "loading_profile": "正在加载资料...",

      "my_events": "我的活动",
      "active_events": "进行中的活动",
      "no_events_created": "您还没有创建任何活动。",
      "create_first_event": "创建我的第一个活动",
      "delete_confirm": "您确定要删除此活动吗？",
      "delete_success": "活动已成功删除",
      "coming_soon": "功能即将推出",

      "no_favorites": "您还没有收藏的活动。",
      "explore_events": "探索活动"
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
