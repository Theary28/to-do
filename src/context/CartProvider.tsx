import { useMemo, useReducer, type ReactNode } from 'react'
import { CartContext } from './cart'
import { cartReducer, initialCart } from './cartReducer'

export function CartProvider({ children }: { children: ReactNode }) {
  const [{ lines }, dispatch] = useReducer(cartReducer, initialCart)

  const value = useMemo(() => {
    let itemCount = 0
    let subtotal = 0
    for (const line of lines) {
      itemCount += line.quantity
      subtotal += line.product.price * line.quantity
    }
    return { lines, itemCount, subtotal, dispatch }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
