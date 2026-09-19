import { useCallback, useEffect, useState } from 'react'

export type FetchState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export type UseFetchResult<T> = FetchState<T> & {
  refetch: () => void
}

export const NOT_FOUND_ERROR = 'Not found'

// A settled response remembers which request it answers, so `loading` can be
// derived during render instead of set synchronously inside the effect.
type Settled<T> = {
  requestKey: string
  data: T | null
  error: string | null
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)
  const requestKey = `${attempt}:${url}`

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function load(): Promise<T> {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(
          response.status === 404 ? NOT_FOUND_ERROR : `Request failed with status ${response.status}`,
        )
      }
      // response.json() is typed `Promise<any>`. Receive it as `unknown` so the
      // any can't leak; this cast is the one place we trust the server's shape.
      const body: unknown = await response.json()
      return body as T
    }

    load()
      .then((data) => {
        if (!cancelled) setSettled({ requestKey, data, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Something went wrong'
        setSettled({ requestKey, data: null, error: message })
      })

    // Cleanup: abort the in-flight request and ignore whatever it resolves to,
    // so a stale response for an old URL can never overwrite the current one.
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [url, requestKey])

  const refetch = useCallback(() => setAttempt((n) => n + 1), [])

  const current = settled?.requestKey === requestKey ? settled : null
  return {
    data: current?.data ?? null,
    loading: current === null,
    error: current?.error ?? null,
    refetch,
  }
}
