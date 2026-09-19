import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import TodoApp from './components/todos/TodoApp'
import WindowWidth from './components/WindowWidth'
import UserDirectory from './pages/UserDirectory'
import UserDetail from './pages/UserDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <nav className="nav">
          <NavLink to="/todos">Todos</NavLink>
          <NavLink to="/users">Users</NavLink>
        </nav>
        <WindowWidth />
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/todos" replace />} />
          <Route path="/todos" element={<TodoApp />} />
          <Route path="/users" element={<UserDirectory />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
