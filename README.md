# Todo App

A React + TypeScript + Vite app that grows each module. So far it has:

- lifted todo state
- a live effect
- a race-safe user directory
- React Router
- a generic `useFetch<T>`
- an `AuthContext`
- a `useReducer` cart shared through context

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc, strict mode
npm run build      # typecheck + production build
npm run lint
```

## Routes

| Path         | View                                                     |
| ------------ | -------------------------------------------------------- |
| `/`          | Redirects to `/todos`                                    |
| `/todos`     | `TodoApp`: add, toggle, delete, filter, clear completed  |
| `/users`     | `UserDirectory`: searchable list from JSONPlaceholder    |
| `/users/:id` | `UserDetail`: reads `id` with `useParams`                |
| `/shop`      | `Shop`: products from Fake Store API, with Add to cart   |
| `/cart`      | `Cart`: quantity steppers, remove, and `CheckoutSummary` |
| `*`          | `NotFound`: 404 catch-all                                |

Navigation uses `NavLink` and `Link`, so there are no full page reloads.

## Structure

```
src/
  main.tsx                     <BrowserRouter> → <AuthProvider> → <CartProvider> → <App>
  App.tsx                      <NavBar> + <Routes>
  api.ts                       API URLs, formatPrice()
  types.ts                     Todo, Filter, User, Product
  hooks/
    useFetch.ts                useFetch<T>(url) → { data: T | null, loading, error, refetch }
    useFetch.typecheck.ts      compile-time proof that data needs a null check
  context/
    auth.ts                    AuthContext, useAuth()
    AuthProvider.tsx           user state, signIn(email), signOut()
    cartReducer.ts             CartAction union + pure cartReducer
    cart.ts                    CartContext, useCart()
    CartProvider.tsx           useReducer + itemCount / subtotal
  components/
    NavBar.tsx                 "Sign in" form or "Hi, {user.email}", cart badge
    CheckoutSummary.tsx        no props, reads useCart() and useAuth()
    WindowWidth.tsx            live resize effect
    todos/                     TodoApp, AddTodo, TodoList, FilterBar
  pages/
    Shop.tsx  Cart.tsx  UserDirectory.tsx  UserDetail.tsx  NotFound.tsx
```

## Module 2: architecture

### Generic `useFetch<T>`

`useFetch<User[]>(url)` returns `{ data: User[] | null; loading: boolean; error: string | null }`.

- **No hidden `any`:** `response.json()` is typed `any`, so the hook stores the result as `unknown` and casts to `T` in one place. The lint rule `typescript/no-explicit-any` is set to `error`.
- **`data` needs a null check:** [`useFetch.typecheck.ts`](src/hooks/useFetch.typecheck.ts) is part of `npm run typecheck`. It shows that `users.data.map(...)` is rejected with **TS18047: 'users.data' is possibly 'null'**, and that inside `if (users.data)` the value narrows to `User[]`.
- **Stale requests can't win:** changing the URL aborts the previous request and ignores whatever it returns.

### AuthContext

- `useAuth()` throws if it's called outside `<AuthProvider>`, so a consumer sitting above its provider fails loudly instead of silently reading `null`.
- `NavBar` shows an email form with **Sign in** when signed out, and **Hi, {user.email}** with **Sign out** when signed in.

### CartContext and reducer

```ts
type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
```

- **Add to cart** dispatches `ADD_ITEM`. The **−** and **+** buttons dispatch `UPDATE_QUANTITY`, and **×** dispatches `REMOVE_ITEM`.
- `UPDATE_QUANTITY` with a quantity of 0 or less removes the line.
- **No prop carries cart data.** `Cart`, `CheckoutSummary`, and the `NavBar` badge each call `useCart()` themselves.

**Audit checklist:**

- [x] Every consumer sits below its provider. `main.tsx` wraps `<App>` in both providers, and the hooks throw otherwise.
- [x] The reducer is pure. It has no `fetch`, `localStorage`, or `console`, and never changes `state` in place.
- [x] The `default` branch returns `state` untouched. `action satisfies never` there also makes an unhandled action type a compile error.

**How the action type keeps quantity -1 out of the cart:**
Because `CartAction` is a discriminated union, `ADD_ITEM` carries no quantity field at all and can only create a line at 1 or add one to it. That leaves `UPDATE_QUANTITY` as the only way to set a quantity, and the reducer handles it by removing the line whenever the quantity is 0 or less. So a line with quantity -1 can never be stored.

## Effects and what their cleanup prevents

- **`WindowWidth` (resize listener):** the cleanup removes the `resize` listener, so an unmounted component is never updated and StrictMode's remount doesn't leave duplicate listeners behind.
- **`useFetch` (used by `UserDirectory`, `UserDetail`, and `Shop`):** the cleanup aborts the request and sets `cancelled = true`, so when the URL changes mid-request, the slower, stale response can't overwrite the current one.
- **`TodoApp` (save to `localStorage`):** no cleanup is needed, because it's a synchronous write that leaves nothing running. It keeps todos when you navigate away and back.

## AI use

The brief asked for the **AuthContext** and the **cart reducer and context** to be hand-written. At my request, an AI assistant (Claude) wrote them, along with the rest of this module:

- `src/context/auth.ts`
- `src/context/AuthProvider.tsx`
- `src/context/cartReducer.ts`
- `src/context/cart.ts`
- `src/context/CartProvider.tsx`

The commits that added them say so too.

## Screenshots

| | |
|---|---|
| NavBar: signed out | ![](screenshots/11-navbar-signed-out.png) |
| NavBar: signed in | ![](screenshots/12-navbar-signed-in.png) |
| Cart: T-Shirt at quantity 1 (highlighted) | ![](screenshots/13-cart-before-decrement.png) |
| Cart: after **−**, the T-Shirt line is gone | ![](screenshots/14-cart-after-decrement.png) |
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

To see the loading or error states yourself, use DevTools → Network and throttle to "Slow 4G" or "Offline".
