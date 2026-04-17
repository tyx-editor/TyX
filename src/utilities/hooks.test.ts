import { act, renderHook } from "@testing-library/react"
import { getLocalStorage, setLocalStorage, useLocalStorage } from "./hooks"

afterEach(() => {
  localStorage.clear()
})

describe("getLocalStorage", () => {
  it("returns default value when key is absent", () => {
    const result = getLocalStorage<string[]>("Missing Key", [])
    expect(result).toEqual([])
  })

  it("returns stored value when key exists", () => {
    localStorage.setItem("My Key", JSON.stringify({ foo: "bar" }))
    const result = getLocalStorage<{ foo: string }>("My Key")
    expect(result).toEqual({ foo: "bar" })
  })

  it("returns {} as default when no default provided", () => {
    const result = getLocalStorage("Empty")
    expect(result).toEqual({})
  })
})

describe("setLocalStorage", () => {
  it("stores JSON-serialized value", () => {
    setLocalStorage("Test Key", { x: 1 })
    expect(localStorage.getItem("Test Key")).toBe('{"x":1}')
  })

  it("dispatches StorageEvent with correct key and newValue", () => {
    const listener = vi.fn()
    window.addEventListener("storage", listener)
    try {
      setLocalStorage("Dispatch Key", 42)
      expect(listener).toHaveBeenCalledOnce()
      const event = listener.mock.calls[0][0] as StorageEvent
      expect(event.key).toBe("Dispatch Key")
      expect(event.newValue).toBe("42")
    } finally {
      window.removeEventListener("storage", listener)
    }
  })
})

describe("useLocalStorage", () => {
  it("returns default value on first render", () => {
    const { result } = renderHook(() =>
      useLocalStorage<number[]>({ key: "Hook Key", defaultValue: [] }),
    )
    expect(result.current[0]).toEqual([])
  })

  it("returns stored value if already in storage", () => {
    localStorage.setItem("Pre Key", JSON.stringify("stored"))
    const { result } = renderHook(() =>
      useLocalStorage<string>({ key: "Pre Key" }),
    )
    expect(result.current[0]).toBe("stored")
  })

  it("updates state when setter is called", () => {
    const { result } = renderHook(() =>
      useLocalStorage<number>({ key: "Counter", defaultValue: 0 }),
    )
    act(() => {
      result.current[1](99)
    })
    expect(result.current[0]).toBe(99)
    expect(localStorage.getItem("Counter")).toBe("99")
  })

  it("updates state when external StorageEvent fires", () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>({ key: "External Key", defaultValue: "init" }),
    )
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "External Key",
          newValue: JSON.stringify("updated"),
        }),
      )
    })
    expect(result.current[0]).toBe("updated")
  })
})
