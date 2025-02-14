import type { JSONContent } from "@tiptap/react"

export interface TyXDocument {
  filename?: string
  content: JSONContent
  dirty?: boolean
}
