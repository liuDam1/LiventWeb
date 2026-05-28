import { loadStripe } from '@stripe/stripe-js'

// Inicializar Stripe con la clave pública de las variables de entorno
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!publishableKey) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY no está definida. Los pagos no funcionarán.')
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export default stripePromise
