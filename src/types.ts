export type Todo = {
  id: string
  text: string
  completed: boolean
}

export type Filter = 'all' | 'active' | 'completed'

// The subset of JSONPlaceholder's /users fields this app reads.
export type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: { city: string }
  company: { name: string }
}
