# Todo App

A React + Vite app with lifted todo state, a live effect, a race-safe user directory, and client-side routing with React Router.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint
```

## Routes

| Path         | View                                             |
| ------------ | ------------------------------------------------ |
| `/`          | Redirects to `/todos`                            |
| `/todos`     | `TodoApp`: add, toggle, delete, filter, clear completed |
| `/users`     | `UserDirectory`: searchable list from JSONPlaceholder |
| `/users/:id` | `UserDetail`: reads `id` with `useParams`        |
| `*`          | `NotFound`: 404 catch-all                        |

Navigation uses `NavLink` and `Link`, so there are no full page reloads.

## Structure

```
src/
  App.jsx                    header nav + <Routes>
  main.jsx                   <BrowserRouter>
  api.js                     fetch helper that throws on non-2xx
  components/
    WindowWidth.jsx          live resize effect
    todos/
      TodoApp.jsx            owns todos[] + filter; passes props down
      AddTodo.jsx            onAdd(text)
      TodoList.jsx           onToggle(id), onDelete(id)
      FilterBar.jsx          onFilterChange(f), onClearCompleted()
  pages/
    UserDirectory.jsx        loading skeleton / error / empty / list
    UserDetail.jsx
    NotFound.jsx
```

`TodoApp` is the only component that holds the todos array. `AddTodo`, `TodoList`, and `FilterBar` never talk to each other. They get data as props and report changes through callbacks.

## Effects and what their cleanup prevents

- **`WindowWidth` (resize listener):** the cleanup removes the `resize` listener, so an unmounted component is never updated and StrictMode's remount doesn't leave duplicate listeners behind.
- **`UserDirectory` (fetch on search):** the cleanup sets `cancelled = true`, so when the search term changes before a request finishes, the slower, stale response can't overwrite the newer results.
- **`UserDetail` (fetch on `:id`):** the cleanup sets `cancelled = true`, so if you navigate from one user to another mid-request, the old user's data can never land on the new user's page.
- **`TodoApp` (save to `localStorage`):** no cleanup is needed, because it's a synchronous write that leaves nothing running. It keeps todos when you navigate to `/users` and back.

## Screenshots

| | |
|---|---|
| Todos: all | ![](screenshots/01-todos-all.png) |
| Todos: Active filter | ![](screenshots/02-todos-active.png) |
| Todos: Completed filter | ![](screenshots/03-todos-completed.png) |
| Todos: after "Clear completed" | ![](screenshots/04-todos-after-clear.png) |
| Users: loading skeleton | ![](screenshots/05-users-loading.png) |
| Users: loaded | ![](screenshots/06-users-loaded.png) |
| Users: empty search | ![](screenshots/07-users-empty.png) |
| Users: error | ![](screenshots/08-users-error.png) |
| `/users/3` opened directly | ![](screenshots/09-user-direct-link.png) |
| Garbage URL → 404 | ![](screenshots/10-404.png) |

To see the skeleton or error state yourself, use DevTools → Network → throttle to "Slow 4G" or "Offline".
