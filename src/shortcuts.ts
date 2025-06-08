/**
 * @file Initialize and update keyboard shortcuts based on user settings.
 * Based on Mousetrap.
 */

import "mousetrap"
import "mousetrap-global-bind"
// @ts-ignore
import record from "mousetrap-record"

import { executeCommand, parseCommandSequence } from "./commands"
import { TyXSettings } from "./models"
import { getLocalStorage } from "./utilities/hooks"

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

// TODO: add more default shortcuts.
export const DEFAULT_KEYBOARD_SHORTCUTS: [string, string][] = [
  ["mod+b", "toggleBold"],
  ["mod+i", "toggleItalic"],
  ["mod+u", "toggleUnderline"],
  ["mod+shift+x", "toggleStrike"],
  ["mod+shift+h", "toggleHighlight"],
  ["mod+e", "toggleCode"],
  ["mod+z", "undo"],
  ["mod+shift+z", "redo"],
  ["shift+enter", "setHardBreak"],
  ["mod+enter", "setHardBreak"],
  ["mod+l", "toggleTypstCode"],
  ["mod+m", "insertMathInline"],
  ["mod+shift+m", "insertMathBlock"],
  ["ctrl+g a", "math insert \\alpha"],
]

/** Bind the shortcuts from the user's settings to their commands. */
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

/** Performs initialization routines for using keyboard shortcuts, setting up Mousetrap and applying the shortcuts from settings. */
export const initializeKeyboardShortcuts = () => {
  record(Mousetrap)

  applyKeyboardShortcutsFromSettings()
}

/** Unbinds the currently bound keyboard shortcuts and re-binds everything from user settings. */
export const refreshKeyboardShortcuts = () => {
  Mousetrap.reset()
  applyKeyboardShortcutsFromSettings()
}
