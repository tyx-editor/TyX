import { vi } from "vitest"

vi.mock("mousetrap", () => ({ default: {} }))
vi.mock("mousetrap-record", () => ({ default: () => {} }))
vi.mock("./settings", () => ({
  getSettings: vi.fn(),
}))

import { getSettings } from "./settings"
import {
  DEFAULT_KEYBOARD_SHORTCUTS,
  getKeyboardShortcuts,
  reverseKeyboardShortcuts,
  updateReverseKeyboardShortcuts,
} from "./shortcuts"

const mockGetSettings = vi.mocked(getSettings)

beforeEach(() => {
  vi.resetAllMocks()
})

describe("getKeyboardShortcuts", () => {
  it("returns default shortcuts when settings has none", () => {
    mockGetSettings.mockReturnValue({})
    const shortcuts = getKeyboardShortcuts()
    expect(shortcuts).toEqual(DEFAULT_KEYBOARD_SHORTCUTS)
  })

  it("prepends user shortcuts before defaults", () => {
    mockGetSettings.mockReturnValue({
      keyboardShortcuts: [["ctrl+x", "customCommand"]],
    })
    const shortcuts = getKeyboardShortcuts()
    expect(shortcuts[0]).toEqual(["ctrl+x", "customCommand"])
    expect(shortcuts.length).toBe(DEFAULT_KEYBOARD_SHORTCUTS.length + 1)
  })

  it("excludes unbound default shortcuts", () => {
    mockGetSettings.mockReturnValue({
      unbindKeyboardShortcuts: ["mod+b"],
    })
    const shortcuts = getKeyboardShortcuts()
    const hasBold = shortcuts.some((s) => s[0] === "mod+b")
    expect(hasBold).toBe(false)
  })

  it("user shortcuts are not removed by unbindKeyboardShortcuts", () => {
    mockGetSettings.mockReturnValue({
      keyboardShortcuts: [["mod+b", "myCommand"]],
      unbindKeyboardShortcuts: ["mod+b"],
    })
    const shortcuts = getKeyboardShortcuts()
    const userShortcut = shortcuts.find(
      (s) => s[0] === "mod+b" && s[1] === "myCommand",
    )
    expect(userShortcut).toBeDefined()
  })
})

describe("updateReverseKeyboardShortcuts", () => {
  afterEach(() => {
    for (const key in reverseKeyboardShortcuts) {
      delete reverseKeyboardShortcuts[key]
    }
  })

  it("maps command → shortcut", () => {
    mockGetSettings.mockReturnValue({})
    updateReverseKeyboardShortcuts()
    expect(reverseKeyboardShortcuts["formatText bold"]).toBe("mod+b")
    expect(reverseKeyboardShortcuts["undo"]).toBe("mod+z")
  })

  it("clears previous entries before rebuilding", () => {
    mockGetSettings.mockReturnValue({})
    updateReverseKeyboardShortcuts()
    mockGetSettings.mockReturnValue({
      unbindKeyboardShortcuts: ["mod+b"],
    })
    updateReverseKeyboardShortcuts()
    expect(reverseKeyboardShortcuts["formatText bold"]).toBeUndefined()
  })

  it("includes user-defined shortcuts in reverse map", () => {
    mockGetSettings.mockReturnValue({
      keyboardShortcuts: [["ctrl+x", "customCommand"]],
    })
    updateReverseKeyboardShortcuts()
    expect(reverseKeyboardShortcuts["customCommand"]).toBe("ctrl+x")
  })
})
