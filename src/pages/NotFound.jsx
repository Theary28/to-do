import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <section className="card not-found">
      <h1>404</h1>
      <p>
        Nothing lives at <code>{pathname}</code>.
      </p>
      <Link to="/todos">Go to your todos</Link>
    </section>
  )
}
