/**
 * @file TypeScript models used by TyX.
 */

import type { JSONContent, SingleCommands } from "@tiptap/react"
import { z } from "zod/v4"

/** An object representing Typst `relative` or `fraction` types. */
export interface TyXLength {
  unit?: string
  value?: string
}

/** Compilation options passed to the Typst compiler. */
export interface TyXCompilationOptions {
  root?: string
  fontPaths?: string[]
}

/** An object wrapping some common Typst document configuration options. */
export interface TyXDocumentSettings extends TyXCompilationOptions {
  language?: string
  paper?: string
  flipped?: boolean
  justified?: boolean
  indentation?: { unit?: string; value?: string }
  columns?: number
}

/** An object representing an entire TyX document. Saved in `.tyx` files. */
export interface TyXDocument {
  version: string
  preamble?: string
  filename?: string
  content: JSONContent
  dirty?: boolean
  settings?: TyXDocumentSettings
}

export const TyXSettings = z.object({
  language: z.string().optional(),
  keyboardShortcuts: z.array(z.tuple([z.string(), z.string()])).optional(),
  keyboardMap: z.string().nullable().optional(),
  mathInlineShortcuts: z.array(z.tuple([z.string(), z.string()])).optional(),
})

export type TyXSettings = z.infer<typeof TyXSettings>

// TODO: perhaps support "global" commands, such as switching between documents etc.
/** The type of TyX commands which can be executed on the current document. */
export type TyXCommand = [keyof SingleCommands, ...any]
