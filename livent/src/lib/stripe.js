import { loadStripe } from '@stripe/stripe-js'

// Inicializar Stripe con la clave pública de las variables de entorno
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default stripePromise
