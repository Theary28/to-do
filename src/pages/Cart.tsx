import { Link } from 'react-router-dom'
import { formatPrice } from '../api'
import CheckoutSummary from '../components/CheckoutSummary'
import { useCart } from '../context/cart'

export default function Cart() {
  const { lines, dispatch } = useCart()

  if (lines.length === 0) {
    return (
      <section className="card">
        <h1>Cart</h1>
        <p className="empty">
          Your cart is empty. <Link to="/shop">Browse the shop</Link>
        </p>
      </section>
    )
  }

  // Lines are rendered here rather than in a child component, so no prop
  // ever carries cart data.
  return (
    <section className="card">
      <h1>Cart</h1>
      <ul className="cart-lines">
        {lines.map(({ product, quantity }) => (
          <li key={product.id} className="cart-line">
            <img className="cart-thumb" src={product.image} alt="" />
            <div className="cart-info">
              <span className="product-title">{product.title}</span>
              <span className="muted">{formatPrice(product.price)} each</span>
            </div>
            <div className="stepper" role="group" aria-label={`Quantity of ${product.title}`}>
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() =>
                  dispatch({ type: 'UPDATE_QUANTITY', productId: product.id, quantity: quantity - 1 })
                }
              >
                −
              </button>
              <span className="quantity" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  dispatch({ type: 'UPDATE_QUANTITY', productId: product.id, quantity: quantity + 1 })
                }
              >
                +
              </button>
            </div>
            <strong className="line-total">{formatPrice(product.price * quantity)}</strong>
            <button
              type="button"
              className="icon-button"
              aria-label={`Remove ${product.title}`}
              onClick={() => dispatch({ type: 'REMOVE_ITEM', productId: product.id })}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <CheckoutSummary />
    </section>
  )
}
