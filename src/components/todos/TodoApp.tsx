import { useState } from 'react'
import AddTodo from './AddTodo'
import TodoList from './TodoList'
import FilterBar from './FilterBar'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Filter, Todo } from '../../types'

const FILTERS: Record<Filter, (todo: Todo) => boolean> = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
}

// TodoApp is the single owner of the todos array and the active filter.
// Children receive data via props and report changes via callbacks.
export default function TodoApp() {
  // Persisted so todos survive navigating away and refreshing.
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [])
  const [filter, setFilter] = useState<Filter>('all')

  function addTodo(text: string) {
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, completed: false }])
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    )
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const visibleTodos = todos.filter(FILTERS[filter])
  const activeCount = todos.filter(FILTERS.active).length
  const completedCount = todos.length - activeCount

  return (
    <section className="card">
      <h1>Todos</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={visibleTodos} filter={filter} onToggle={toggleTodo} onDelete={deleteTodo} />
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        activeCount={activeCount}
        completedCount={completedCount}
        onClearCompleted={clearCompleted}
      />
    </section>
  )
}
