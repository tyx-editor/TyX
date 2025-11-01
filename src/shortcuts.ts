/**
 * @file Initialize and update keyboard shortcuts based on user settings.
 * Based on Mousetrap.
 */

import "mousetrap"
// @ts-ignore
import record from "mousetrap-record"

import { ExtendedKeyboardEvent } from "mousetrap"
import { executeCommandSequence } from "./commands"
import { getSettings } from "./settings"
import { setLocalStorage } from "./utilities/hooks"

declare global {
  namespace Mousetrap {
    interface MousetrapStatic {
      record(callback: (result: string[]) => void): void
    }
  }
}

// TODO: add more default shortcuts.
export const DEFAULT_KEYBOARD_SHORTCUTS: [string, string][] = [
  ["mod+o", "fileOpen"],
  ["mod+n", "fileNew"],
  ["mod+shift+n", "fileNewFromTemplate"],
  ["mod+s", "fileSave"],
  ["mod+shift+s", "fileSaveAs"],
  ["mod+w", "fileClose"],
  ["mod+shift+k", "filePreview"],
  ["mod+b", "formatText bold"],
  ["mod+i", "formatText italic"],
  ["mod+u", "formatText underline"],
  ["mod+shift+x", "formatText strikethrough"],
  ["mod+shift+h", "formatText highlight"],
  ["mod+e", "formatText code"],
  ["mod+z", "undo"],
  ["mod+shift+z", "redo"],
  ["shift+enter", "insertLineBreak false"],
  ["mod+enter", "insertLineBreak false"],
  ["mod+l", "insertTypstCode"],
  ["mod+m", "insertMath true"],
  ["mod+shift+m", "toggleMathInline"],
  ["mod+shift+f", "insertFunctionCall"],
  ["mod+k", "openLinkPopup"],
  ["mod+;", "openSettings"],
  ["mod+shift+;", "openDocumentSettings"],
]

export const getKeyboardShortcuts = () => {
  const settings = getSettings()
  return (settings.keyboardShortcuts ?? []).concat(
    DEFAULT_KEYBOARD_SHORTCUTS.filter(
      (shortcut) => !settings.unbindKeyboardShortcuts?.includes(shortcut[0]),
    ),
  )
}

/** Bind the shortcuts from the user's settings to their commands. */
export const applyKeyboardShortcutsFromSettings = () => {
  const shortcuts = getKeyboardShortcuts()

  for (const shortcut of shortcuts) {
    if (!shortcut[0] || !shortcut[1]) {
      continue
    }

    Mousetrap.bind(shortcut[0], (e) => {
      e.preventDefault()

      executeCommandSequence(shortcut[1])
    })
  }
}

export const reverseKeyboardShortcuts: Record<string, string> = {}

/** Updates the reverse mapping from a TyX command sequence string to a keyboard shortcut. */
export const updateReverseKeyboardShortcuts = () => {
  for (const key in reverseKeyboardShortcuts) {
    delete reverseKeyboardShortcuts[key]
  }
  const shortcuts = getKeyboardShortcuts()
  for (const shortcut of shortcuts) {
    if (!shortcut[0] || !shortcut[1]) {
      continue
    }

    reverseKeyboardShortcuts[shortcut[1]] = shortcut[0]
  }
}

/** Performs initialization routines for using keyboard shortcuts, setting up Mousetrap and applying the shortcuts from settings. */
export const initializeKeyboardShortcuts = () => {
  record(Mousetrap)
  Mousetrap.prototype.stopCallback = () => false

  const allSequences = new Set<string>()

  let pressed: string[] = []

  const split = (s: string) => s.split(/\s+/).filter(Boolean)

  const getNextKeys = function () {
    const next = new Set<string>()
    for (const sequence of allSequences) {
      const parts = split(sequence)
      if (pressed.length > 0) {
        for (let i = 0; i < pressed.length; ++i) {
          const currentParts = pressed.slice(i)
          const N = currentParts.length
          if (
            N > 0 &&
            parts.length > N &&
            parts.slice(0, N).join(" ") === currentParts.join(" ")
          ) {
            next.add(parts[N])
            break
          }
        }
      }
    }
    return [...next].sort()
  }

  const origBind = Mousetrap.prototype.bind
  Mousetrap.prototype.bind = function (
    keys: string | string[],
    ...rest: any[]
  ) {
    for (const k of Array.isArray(keys) ? keys : [keys]) {
      allSequences.add(k.trim())
    }
    return origBind.call(this, keys, ...rest)
  }

  const origHandleKey = Mousetrap.prototype.handleKey
  Mousetrap.prototype.handleKey = function (
    character: string,
    modifiers: string[],
    e: ExtendedKeyboardEvent,
  ) {
    const combo = [...modifiers, character].join("+")
    const res = origHandleKey.call(this, character, modifiers, e)
    if (e?.type !== "keydown") {
      return res
    }

    pressed.push(combo)
    setLocalStorage("Next Keys", getNextKeys())
    setTimeout(() => {
      pressed = []
    }, 1000)
    return res
  }

  applyKeyboardShortcutsFromSettings()
  updateReverseKeyboardShortcuts()
}

/** Unbinds the currently bound keyboard shortcuts and re-binds everything from user settings. */
export const refreshKeyboardShortcuts = () => {
  Mousetrap.reset()
  applyKeyboardShortcutsFromSettings()
  updateReverseKeyboardShortcuts()
}
