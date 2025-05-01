import type { JSONContent } from "@tiptap/react"

export interface TyXDocument {
  version: string
  preamble?: string
  filename?: string
  content: JSONContent
  dirty?: boolean
}
