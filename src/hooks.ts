import { useState, useEffect } from "react"

export const getLocalStorage = <T>(key: string, defaultValue = {}): T => {
  return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue))
}

export const setLocalStorage = (key: string, item: any) => {
  const newValue = JSON.stringify(item)
  localStorage.setItem(key, newValue)
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }))
}

export const useLocalStorage = <T>({
  key,
  defaultValue,
}: {
  key: string
  defaultValue?: any
}): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(
    getLocalStorage(key, defaultValue ?? null)
  )

  useEffect(() => {
    if (!localStorage.getItem(key) && defaultValue) {
      localStorage.setItem(key, JSON.stringify(defaultValue))
    }

    const listener = (e: StorageEvent) => {
      if (e.key === key) {
        if (e.newValue) {
          setValue(JSON.parse(e.newValue))
        } else {
          setValue(defaultValue ?? null)
        }
      }
    }

    window.addEventListener("storage", listener)

    return () => window.removeEventListener("storage", listener)
  }, [key])

  const userSetValue = (newValue: any) => {
    setValue(newValue)
    if (typeof newValue === "function") {
      newValue = newValue(value)
    }
    if (newValue !== undefined) {
      localStorage.setItem(key, JSON.stringify(newValue))
      window.dispatchEvent(
        new StorageEvent("storage", { key, newValue: JSON.stringify(newValue) })
      )
    }
  }

  return [value, userSetValue]
}
