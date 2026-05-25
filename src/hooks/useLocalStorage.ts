import { useCallback, useState } from 'react'

function readStoredValue<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return initial
    }
    return JSON.parse(item) as T
  } catch {
    return initial
  }
}

export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readStoredValue(key, initial))

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // localStorage may throw in private browsing or when quota is exceeded
        }
        return resolved
      })
    },
    [key],
  )

  return [value, setStoredValue]
}
