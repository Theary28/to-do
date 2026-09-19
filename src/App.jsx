import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import TodoApp from './components/todos/TodoApp.jsx'
import WindowWidth from './components/WindowWidth.jsx'
import UserDirectory from './pages/UserDirectory.jsx'
import UserDetail from './pages/UserDetail.jsx'
import NotFound from './pages/NotFound.jsx'

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
