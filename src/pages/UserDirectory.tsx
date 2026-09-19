import { useState } from 'react'
import { Link } from 'react-router-dom'
import { USERS_API } from '../api'
import { useFetch } from '../hooks/useFetch'
import type { User } from '../types'

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
  const term = query.trim()
  const url = term ? `${USERS_API}?q=${encodeURIComponent(term)}` : USERS_API
  // Race safety lives in useFetch: a new term cancels the previous request.
  const { data: users, loading, error, refetch } = useFetch<User[]>(url)

  let content
  if (loading) {
    content = <UserListSkeleton />
  } else if (error) {
    content = (
      <div className="error" role="alert">
        <p>Couldn&apos;t load users: {error}</p>
        <button type="button" onClick={refetch}>
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
