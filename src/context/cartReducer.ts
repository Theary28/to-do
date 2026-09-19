import type { Product } from '../types'

export type CartLine = {
  product: Product
  quantity: number
}

export type CartState = {
  lines: CartLine[]
}

// Each action carries only the fields it needs. ADD_ITEM has no quantity at
// all, so the only way to set a number is UPDATE_QUANTITY, and the reducer
// turns any quantity of 0 or less into a removal.
export type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }

export const initialCart: CartState = { lines: [] }

// Pure: no fetch, no storage, no logging. Every branch returns new objects
// or the untouched state.
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.lines.find((line) => line.product.id === action.product.id)
      if (existing) {
        return {
          lines: state.lines.map((line) =>
            line === existing ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        }
      }
      return { lines: [...state.lines, { product: action.product, quantity: 1 }] }
    }

    case 'REMOVE_ITEM':
      return { lines: state.lines.filter((line) => line.product.id !== action.productId) }

    case 'UPDATE_QUANTITY': {
      const quantity = Math.floor(action.quantity)
      if (quantity <= 0) {
        return { lines: state.lines.filter((line) => line.product.id !== action.productId) }
      }
      return {
        lines: state.lines.map((line) =>
          line.product.id === action.productId ? { ...line, quantity } : line,
        ),
      }
    }

    default:
      // If a new action type is added but not handled, this line stops compiling.
      action satisfies never
      return state
  }
}
