/**
 * @file Initialize and update keyboard shortcuts based on user settings.
 * Based on Mousetrap.
 */

import "mousetrap"
import "mousetrap-global-bind"
// @ts-ignore
import record from "mousetrap-record"

import { executeCommandSequence } from "./commands"
import { getSettings } from "./settings"

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
  ["ctrl+g a", "math insert \\alpha"],
  ["mod+k", "openLinkPopup"],
]

/** Bind the shortcuts from the user's settings to their commands. */
export const applyKeyboardShortcutsFromSettings = () => {
  const shortcuts =
    getSettings().keyboardShortcuts ?? DEFAULT_KEYBOARD_SHORTCUTS

  for (const shortcut of shortcuts) {
    if (!shortcut[0] || !shortcut[1]) {
      continue
    }

    Mousetrap.bindGlobal(shortcut[0], (e) => {
      e.preventDefault()

      executeCommandSequence(shortcut[1])
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
