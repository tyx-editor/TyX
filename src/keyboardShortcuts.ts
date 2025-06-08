import { getLocalStorage } from "./hooks"
import { DEFAULT_KEYBOARD_SHORTCUTS, TyXSettings } from "./models"

import "mousetrap"
import "mousetrap-global-bind"
// @ts-ignore
import record from "mousetrap-record"
import { executeCommand, parseCommandSequence } from "./commands"

declare global {
  namespace Mousetrap {
    interface MousetrapStatic {
      bindGlobal(
        keyArray: string | string[],
        callback: (e: ExtendedKeyboardEvent, combo: string) => any,
        action?: string,
      ): void
      unbindGlobal(keys: string | string[], action?: string): void
      record(callback: (result: string[]) => void): void
    }
  }
}

export const applyKeyboardShortcutsFromSettings = () => {
  const shortcuts =
    getLocalStorage<TyXSettings>("Settings").keyboardShortcuts ??
    DEFAULT_KEYBOARD_SHORTCUTS
  for (const shortcut of shortcuts) {
    if (!shortcut[0] || !shortcut[1]) {
      continue
    }

    Mousetrap.bindGlobal(shortcut[0], (e) => {
      e.preventDefault()

      for (const command of parseCommandSequence(shortcut[1])) {
        executeCommand(command)
      }
    })
  }
}

export const initializeKeyboardShortcuts = () => {
  record(Mousetrap)

  applyKeyboardShortcutsFromSettings()
}

export const refreshKeyboardShortcuts = () => {
  Mousetrap.reset()
  applyKeyboardShortcutsFromSettings()
}
