import type { JSONContent } from "@tiptap/react"

export interface TypStudioDocument {
  filename?: string
  content: JSONContent
  dirty?: boolean
}
