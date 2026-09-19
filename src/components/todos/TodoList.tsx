import type { Filter, Todo } from '../../types'

type TodoListProps = {
  todos: Todo[]
  filter: Filter
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: 'Nothing to do yet — add your first todo above.',
  active: 'No active todos. Nice work!',
  completed: 'No completed todos yet.',
}

export default function TodoList({ todos, filter, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="empty">{EMPTY_MESSAGES[filter]}</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? 'todo completed' : 'todo'}>
          <label>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
            />
            <span>{todo.text}</span>
          </label>
          <button
            type="button"
            className="icon-button"
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete "${todo.text}"`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
