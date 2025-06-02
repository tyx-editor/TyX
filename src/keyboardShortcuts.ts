import "mousetrap"
import "mousetrap-global-bind"
// @ts-ignore
import record from "mousetrap-record"
import { getLocalStorage } from "./hooks"
import { DEFAULT_KEYBOARD_SHORTCUTS, TyXSettings } from "./models"
import { showFailureMessage } from "./utilities"

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
  for (const shortcut in shortcuts) {
    Mousetrap.bindGlobal(shortcut, (e) => {
      e.preventDefault()

      if (window.currentEditor) {
        const [command, ...parameters] = shortcuts[shortcut]
        const commandFunction = window.currentEditor.commands[command]

        if (!commandFunction) {
          showFailureMessage(
            `Invalid shortcut: command '${command}' does not exist!`,
          )
        } else {
          try {
            // @ts-ignore
            commandFunction(...parameters)
          } catch (e) {
            showFailureMessage(`Command '${command}' threw an exception: ${e}`)
          }
        }
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
