import type { JSONContent, SingleCommands } from "@tiptap/react"

export interface TyXLength {
  unit?: string
  value?: string
}

export interface TyXDocumentSettings {
  language?: string
  paper?: string
  flipped?: boolean
  justified?: boolean
  indentation?: { unit?: string; value?: string }
  columns?: number
}

export interface TyXDocument {
  version: string
  preamble?: string
  filename?: string
  content: JSONContent
  dirty?: boolean
  settings?: TyXDocumentSettings
}

export interface TyXSettings {
  keyboardShortcuts?: Record<string, [keyof SingleCommands, ...any]>
}

export const DEFAULT_KEYBOARD_SHORTCUTS: Record<
  string,
  [keyof SingleCommands, ...any]
> = {
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
  "ctrl+g a": ["math", "insert", "\\alpha"],
}
