import { formatPrice } from '../api'
import { useAuth } from '../context/auth'
import { useCart } from '../context/cart'

const TAX_RATE = 0.1

// Takes no props: everything comes from context.
export default function CheckoutSummary() {
  const { lines, itemCount, subtotal } = useCart()
  const { user } = useAuth()

  if (lines.length === 0) return null

  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  return (
    <aside className="summary" aria-label="Checkout summary">
      <h2>Checkout summary</h2>
      <dl>
        <dt>Items</dt>
        <dd>{itemCount}</dd>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
        <dt>Tax (10%)</dt>
        <dd>{formatPrice(tax)}</dd>
        <dt className="summary-total">Total</dt>
        <dd className="summary-total">{formatPrice(total)}</dd>
      </dl>
      <p className="muted">
        {user ? `Checking out as ${user.email}` : 'Sign in above to check out.'}
      </p>
    </aside>
  )
}
