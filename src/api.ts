export const USERS_API = 'https://jsonplaceholder.typicode.com/users'
export const PRODUCTS_API = 'https://fakestoreapi.com/products'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(amount: number): string {
  return currency.format(amount)
}
