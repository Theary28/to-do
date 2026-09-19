import { createContext, useContext } from 'react'

export type AuthUser = {
  email: string
}

export type AuthContextValue = {
  user: AuthUser | null
  signIn: (email: string) => void
  signOut: () => void
}

// null means "no AuthProvider above this component".
export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (value === null) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return value
}
