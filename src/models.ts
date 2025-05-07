import type { JSONContent } from "@tiptap/react"

export interface TyXDocumentSettings {
  language?: string
  paper?: string
  flipped?: boolean
  justified?: boolean
  indentation?: string
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
