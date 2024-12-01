import { useEffect, useState } from 'react'

export function useLocalStorage(key: string, initialValue: any) {
  const [value, setValue] = useState<any>(initialValue)

  useEffect(() => {
    const storedValue = localStorage.getItem(key)
    setValue(storedValue)
  }, [key])

  const setSessionValue = (newValue: any) => {
    localStorage.setItem(key, newValue)
    setValue(newValue)
  }

  const clearSessionValue = () => {
    localStorage.removeItem(key)
    setValue(null)
  }

  return {
    value,
    setSessionValue,
    clearSessionValue
  }
}
