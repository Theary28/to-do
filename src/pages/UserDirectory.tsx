import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJSON } from '../api'
import type { User } from '../types'

type Result = { requestKey: string | null; users?: User[]; error?: Error }

function UserListSkeleton() {
  return (
    <ul className="user-list" aria-busy="true" aria-label="Loading users">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="user-row">
          <span className="skeleton skeleton-avatar" />
          <span className="skeleton-lines">
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line short" />
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function UserDirectory() {
  const [query, setQuery] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  // Each result remembers which request it answers. While it doesn't match the
  // current request, we're loading — derived during render, not set in the effect.
  const [result, setResult] = useState<Result>({ requestKey: null })

  const term = query.trim()
  const requestKey = `${term}#${reloadKey}`

  useEffect(() => {
    let cancelled = false

    const path = term ? `/users?q=${encodeURIComponent(term)}` : '/users'
    getJSON<User[]>(path)
      .then((users) => {
        if (!cancelled) setResult({ requestKey, users })
      })
      .catch((error: Error) => {
        if (!cancelled) setResult({ requestKey, error })
      })

    // Cleanup: when the query changes (or we unmount) before this request
    // resolves, mark it stale so a slow, older response can't overwrite a newer one.
    return () => {
      cancelled = true
    }
  }, [term, requestKey])

  const { users, error } = result

  let content
  if (result.requestKey !== requestKey) {
    content = <UserListSkeleton />
  } else if (error) {
    content = (
      <div className="error" role="alert">
        <p>Couldn&apos;t load users: {error.message}</p>
        <button type="button" onClick={() => setReloadKey((k) => k + 1)}>
          Try again
        </button>
      </div>
    )
  } else if (!users || users.length === 0) {
    content = (
      <p className="empty">
        No users match “{query}”.{' '}
        <button type="button" className="link-button" onClick={() => setQuery('')}>
          Clear search
        </button>
      </p>
    )
  } else {
    content = (
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`} className="user-row">
              <span className="avatar" aria-hidden="true">
                {user.name.charAt(0)}
              </span>
              <span>
                <strong>{user.name}</strong>
                <span className="muted">{user.email}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className="card">
      <h1>User Directory</h1>
      <input
        type="search"
        className="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search users…"
        aria-label="Search users"
      />
      {content}
    </section>
  )
}
