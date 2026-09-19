import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

function readStored<T>(key: string, initialValue: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? initialValue : (JSON.parse(raw) as T)
  } catch {
    // Storage blocked (private mode) or the stored JSON is corrupt.
    return initialValue
  }
}

// useState that survives a refresh: reads localStorage once on mount and
// writes back whenever the value changes.
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readStored(key, initialValue))

  // No cleanup needed: a synchronous write leaves nothing running.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Quota exceeded or storage blocked: keep working in memory.
    }
  }, [key, value])

  return [value, setValue]
}
