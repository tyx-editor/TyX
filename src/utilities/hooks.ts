import { useForceUpdate } from "@mantine/hooks"
import { Editor } from "@tiptap/react"
import { useEffect, useState } from "react"

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

export const useUpdateOnChange = (editor: Editor | null) => {
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    editor?.on("selectionUpdate", forceUpdate)
    editor?.on("focus", forceUpdate)
    editor?.on("blur", forceUpdate)
  }, [editor])
}
