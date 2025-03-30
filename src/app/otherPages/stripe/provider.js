// app/providers.js
'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export function StripeProvider({ children }) {
  return (
    <Elements stripe={stripePromise} options={{
      appearance: {
        theme: 'stripe',
        labels: 'floating'
      }
    }}>
      {children}
    </Elements>
  )
}