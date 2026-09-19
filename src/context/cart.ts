import { createContext, useContext, type Dispatch } from 'react'
import type { CartAction, CartLine } from './cartReducer'

export type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  dispatch: Dispatch<CartAction>
}

// null means "no CartProvider above this component".
export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const value = useContext(CartContext)
  if (value === null) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return value
}
