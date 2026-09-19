import { useState, type FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/auth'

function AuthControls() {
  const { user, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')

  if (user) {
    return (
      <div className="auth">
        <span className="greeting">Hi, {user.email}</span>
        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    signIn(trimmed)
    setEmail('')
  }

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        aria-label="Email"
        required
      />
      <button type="submit">Sign in</button>
    </form>
  )
}

export default function NavBar() {
  return (
    <header className="app-header">
      <nav className="nav">
        <NavLink to="/todos">Todos</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/shop">Shop</NavLink>
      </nav>
      <AuthControls />
    </header>
  )
}
