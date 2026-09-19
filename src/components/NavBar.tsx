import { NavLink } from 'react-router-dom'
import { useCart } from '../context/cart'
import AuthControls from './AuthControls'
import ThemeToggle from './ThemeToggle'

export default function NavBar() {
  const { itemCount } = useCart()

  return (
    <header className="app-header">
      <nav className="nav">
        <NavLink to="/todos">Todos</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/cart">
          Cart{itemCount > 0 && <span className="badge">{itemCount}</span>}
        </NavLink>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <AuthControls />
      </div>
    </header>
  )
}
