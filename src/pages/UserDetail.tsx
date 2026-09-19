import { Link, useParams } from 'react-router-dom'
import { USERS_API } from '../api'
import { NOT_FOUND_ERROR, useFetch } from '../hooks/useFetch'
import type { User } from '../types'

export default function UserDetail() {
  const { id = '' } = useParams()
  // Switching :id mid-request cancels the old fetch inside useFetch.
  const { data: user, loading, error } = useFetch<User>(`${USERS_API}/${encodeURIComponent(id)}`)

  let content
  if (loading) {
    content = (
      <div aria-busy="true" aria-label="Loading user">
        <span className="skeleton skeleton-title" />
        <span className="skeleton skeleton-line" />
        <span className="skeleton skeleton-line short" />
      </div>
    )
  } else if (error === NOT_FOUND_ERROR) {
    content = <p className="empty">No user with id “{id}”.</p>
  } else if (error) {
    content = (
      <p className="error" role="alert">
        Couldn&apos;t load user: {error}
      </p>
    )
  } else if (user) {
    content = (
      <>
        <h1>{user.name}</h1>
        <p className="muted">@{user.username}</p>
        <dl className="details">
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </dd>
          <dt>Phone</dt>
          <dd>{user.phone}</dd>
          <dt>Website</dt>
          <dd>{user.website}</dd>
          <dt>Company</dt>
          <dd>{user.company.name}</dd>
          <dt>City</dt>
          <dd>{user.address.city}</dd>
        </dl>
      </>
    )
  }

  return (
    <section className="card">
      <Link to="/users" className="back-link">
        ← All users
      </Link>
      {content}
    </section>
  )
}
