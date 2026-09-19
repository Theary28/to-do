import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthUser } from './auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const signIn = useCallback((email: string) => setUser({ email }), [])
  const signOut = useCallback(() => setUser(null), [])

  // Memoised so consumers only re-render when the user actually changes.
  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
