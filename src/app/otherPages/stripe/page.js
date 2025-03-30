// app/checkout/page.js
import { StripeProvider } from '@/app/otherPages/stripe/provider'
import { CheckoutForm } from '@/app/otherPages/stripe/checkoutForm'

export default function CheckoutPage() {
  return (
    <StripeProvider>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>
        <CheckoutForm />
      </div>
    </StripeProvider>
  )
}