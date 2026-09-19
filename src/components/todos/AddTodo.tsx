import { useState, type FormEvent } from 'react'

type AddTodoProps = {
  onAdd: (text: string) => void
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  // Only the in-progress input text lives here; the list itself belongs to TodoApp.
  const [text, setText] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
        aria-label="New todo"
      />
      <button type="submit" disabled={!text.trim()}>
        Add
      </button>
    </form>
  )
}
