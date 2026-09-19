import { PRODUCTS_API, formatPrice } from '../api'
import { useCart } from '../context/cart'
import { useFetch } from '../hooks/useFetch'
import type { Product } from '../types'

function ProductGridSkeleton() {
  return (
    <ul className="product-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="product-card">
          <span className="skeleton product-image" />
          <span className="skeleton skeleton-line" />
          <span className="skeleton skeleton-line short" />
        </li>
      ))}
    </ul>
  )
}

export default function Shop() {
  const { data: products, loading, error, refetch } = useFetch<Product[]>(`${PRODUCTS_API}?limit=6`)
  const { dispatch } = useCart()

  let content
  if (loading) {
    content = <ProductGridSkeleton />
  } else if (error) {
    content = (
      <div className="error" role="alert">
        <p>Couldn&apos;t load products: {error}</p>
        <button type="button" onClick={refetch}>
          Try again
        </button>
      </div>
    )
  } else if (!products || products.length === 0) {
    content = <p className="empty">No products right now.</p>
  } else {
    content = (
      <ul className="product-grid">
        {products.map((product) => (
          <li key={product.id} className="product-card">
            <img className="product-image" src={product.image} alt="" loading="lazy" />
            <span className="product-title">{product.title}</span>
            <strong>{formatPrice(product.price)}</strong>
            <button type="button" onClick={() => dispatch({ type: 'ADD_ITEM', product })}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className="card">
      <h1>Shop</h1>
      {content}
    </section>
  )
}
