import type { JSONContent } from "@tiptap/react"

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
