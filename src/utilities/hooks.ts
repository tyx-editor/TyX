/**
 * @file Useful react hooks for the app.
 */

import { useEffect, useState } from "react"

/** Returns the given JSON-serialized item from local storage. */
export const getLocalStorage = <T>(key: string, defaultValue: any = {}): T => {
  return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue))
}

/** Sets the item in local storage to be the JSON-serialized item, and notifies all listeners of this change. */
export const setLocalStorage = (key: string, item: any) => {
  const newValue = JSON.stringify(item)
  localStorage.setItem(key, newValue)
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }))
}

/** Binds state to the given local storage item, and listens for changes to that item. */
export const useLocalStorage = <T>({
  key,
  defaultValue,
  silent,
}: {
  key: string
  defaultValue?: any
  silent?: boolean
}): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(
    getLocalStorage(key, defaultValue ?? null),
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
      if (!silent) {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: JSON.stringify(newValue),
          }),
        )
      }
    }
  }

  return [value, userSetValue]
}
