import { Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import TodoApp from './components/todos/TodoApp'
import WindowWidth from './components/WindowWidth'
import Shop from './pages/Shop'
import UserDirectory from './pages/UserDirectory'
import UserDetail from './pages/UserDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="app">
      <NavBar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/todos" replace />} />
          <Route path="/todos" element={<TodoApp />} />
          <Route path="/users" element={<UserDirectory />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <WindowWidth />
      </footer>
    </div>
  )
}
