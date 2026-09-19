import { useEffect, useRef, useState } from 'react'

// Returns `value`, but only after it has stopped changing for `delay` ms.
export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setDebounced(value), delay)

    // Cleanup: every new keystroke (or unmount) cancels the pending update, so
    // only the value that sits still for `delay` ms ever gets through.
    return () => clearTimeout(timeoutRef.current)
  }, [value, delay])

  return debounced
}
