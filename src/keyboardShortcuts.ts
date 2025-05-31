import { SingleCommands } from "@tiptap/react"
import "mousetrap"
import "mousetrap-global-bind"

declare global {
  namespace Mousetrap {
    interface MousetrapStatic {
      bindGlobal(
        keyArray: string | string[],
        callback: (e: ExtendedKeyboardEvent, combo: string) => any,
        action?: string,
      ): void
      unbindGlobal(keys: string | string[], action?: string): void
    }
  }
}

export const DEFAULT_SHORTCUTS: Record<string, [keyof SingleCommands, ...any]> =
  {
    "mod+b": ["toggleBold"],
    "mod+i": ["toggleItalic"],
    "mod+u": ["toggleUnderline"],
    "mod+shift+x": ["toggleStrike"],
    "mod+shift+h": ["toggleHighlight"],
    "mod+e": ["toggleCode"],
    "mod+z": ["undo"],
    "mod+shift+z": ["redo"],
    "shift+enter": ["setHardBreak"],
    "mod+enter": ["setHardBreak"],
    "mod+l": ["toggleTypstCode"],
    "mod+m": ["insertMathInline"],
    "mod+shift+m": ["insertMathBlock"],
  }

export const initializeKeyboardShortcuts = () => {
  for (const shortcut in DEFAULT_SHORTCUTS) {
    Mousetrap.bindGlobal(shortcut, () => {
      if (window.currentEditor) {
        const [command, ...parameters] = DEFAULT_SHORTCUTS[shortcut]

        // @ts-ignore
        window.currentEditor.commands[command](...parameters)
      }
    })
  }
}
