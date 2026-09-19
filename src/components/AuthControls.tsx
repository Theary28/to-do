import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useAuth } from '../context/auth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): string | null {
  if (!email) return 'Enter your email address.'
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address, like name@example.com.'
  return null
}

function SignInForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setError(null) // the message goes away as soon as the user starts fixing it
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = email.trim()
    const message = validateEmail(trimmed)
    if (message) {
      setError(message)
      return
    }
    signIn(trimmed)
  }

  return (
    // noValidate: show our own message instead of the browser's tooltip.
    <form className="auth sign-in" onSubmit={handleSubmit} noValidate>
      <label htmlFor="sign-in-email" className="visually-hidden">
        Email
      </label>
      <input
        id="sign-in-email"
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="you@example.com"
        aria-invalid={error !== null}
        aria-describedby={error ? 'sign-in-error' : undefined}
      />
      <button type="submit">Sign in</button>
      {error && (
        <p id="sign-in-error" className="field-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

export default function AuthControls() {
  const { user, signOut } = useAuth()

  if (!user) return <SignInForm />

  return (
    <div className="auth">
      <span className="greeting">Hi, {user.email}</span>
      <button type="button" onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}
