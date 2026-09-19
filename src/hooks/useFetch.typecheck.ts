// Compile-time checks for useFetch's return type. Nothing here runs or ships:
// `npm run typecheck` fails if any expectation below stops holding.
import type { useFetch } from './useFetch'
import type { User } from '../types'

type UsersResult = ReturnType<typeof useFetch<User[]>>
declare const users: UsersResult

// data is `User[] | null`, so TypeScript refuses to map it without a check.
// @ts-expect-error 'users.data' is possibly 'null'.
users.data.map((user) => user.name)

// After the null check, data narrows to User[] and each item is a User.
if (users.data) {
  const names: string[] = users.data.map((user) => user.name)
  void names
}

// The other fields are exactly boolean and string | null, not any.
const loading: boolean = users.loading
const error: string | null = users.error
// @ts-expect-error error is string | null, not number.
const wrong: number = users.error
void [loading, error, wrong]
