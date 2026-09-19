import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getJSON } from '../api.js'

export default function UserDetail() {
  const { id } = useParams()
  // The result records which id it belongs to; a mismatch with the URL means loading.
  const [result, setResult] = useState({ id: null })

  useEffect(() => {
    let cancelled = false

    getJSON(`/users/${encodeURIComponent(id)}`)
      .then((user) => {
        if (!cancelled) setResult({ id, user })
      })
      .catch((error) => {
        if (!cancelled) setResult({ id, error })
      })

    // Cleanup: if :id changes or we navigate away mid-request, ignore the old
    // response so user 1's data can never land on user 2's page.
    return () => {
      cancelled = true
    }
  }, [id])

  const { user, error } = result

  let content
  if (result.id !== id) {
    content = (
      <div aria-busy="true" aria-label="Loading user">
        <span className="skeleton skeleton-title" />
        <span className="skeleton skeleton-line" />
        <span className="skeleton skeleton-line short" />
      </div>
    )
  } else if (error?.status === 404) {
    content = <p className="empty">No user with id “{id}”.</p>
  } else if (error) {
    content = (
      <p className="error" role="alert">
        Couldn&apos;t load user: {error.message}
      </p>
    )
  } else {
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
