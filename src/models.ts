/**
 * @file TypeScript models used by TyX.
 */

import { SerializedEditorState, SerializedLexicalNode } from "lexical"
import { z } from "zod/v4"

/** An object representing any TyX value (which in turn, represents some Typst value) */
export type TyXValue = TyXLengthValue | TyXBooleanValue

export type TyXLengthValue = TyXLength & { type: "length" }

/** An object representing Typst `relative` or `fraction` types. */
export interface TyXLength {
  unit?: string
  value?: string
}

export interface TyXBooleanValue {
  type: "boolean"
  value?: boolean
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
  indentation?: TyXLength
  columns?: number
}

/** An object representing an entire TyX document. Saved in `.tyx` files. */
export interface TyXDocument {
  version: string
  preamble?: string
  filename?: string
  content?: SerializedEditorState<SerializedLexicalNode>
  dirty?: boolean
  settings?: TyXDocumentSettings
}

export const TyXSettings = z.object({
  language: z.string().optional(),
  keyboardShortcuts: z.array(z.tuple([z.string(), z.string()])).optional(),
  keyboardMap: z.string().nullable().optional(),
  mathInlineShortcuts: z.array(z.tuple([z.string(), z.string()])).optional(),
  format: z.boolean().optional(),
  autoStartServer: z.boolean().optional(),
  serverDebounce: z.number().optional(),
})
export const DEFAULT_SERVER_DEBOUNCE_MILLISECONDS = 500

export type TyXSettings = z.infer<typeof TyXSettings>

// TODO: perhaps support "global" commands, such as switching between documents etc.
/** The type of TyX commands which can be executed on the current document. */
export type TyXCommand = [string, ...any]
