/**
 * @file TypeScript models used by TyX.
 */

import {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedRootNode,
} from "lexical"
import { z } from "zod/v4"

/** An object representing any TyX value (which in turn, represents some Typst value) */
export type TyXValue = TyXLengthValue | TyXBooleanValue | TyXContentValue

export type TyXLengthValue = TyXLength & { type: "length" }

/** An object representing Typst `relative` or `fraction` types. */
export interface TyXLength {
  unit?: string
  value?: string
}

/** An object representing Typst `bool` type. */
export interface TyXBooleanValue {
  type: "boolean"
  value?: boolean
}

/** An object representing Typst `content` type. */
export interface TyXContentValue {
  type: "content"
  value?: SerializedRootNode<SerializedLexicalNode>
}

/** Compilation options passed to the Typst compiler. */
export interface TyXCompilationOptions {
  root?: string
  fontPaths?: string[]
}

/** An object wrapping some common Typst document configuration options. */
export interface TyXDocumentSettings extends TyXCompilationOptions {
  /** The language of the document. */
  language?: string
  /** The paper size of the document. */
  paper?: string
  /** Whether the document's page is flipped. */
  flipped?: boolean
  /** Whether the document's text is justified. */
  justified?: boolean
  /** Optional indentation for paragraphs in the document. */
  indentation?: TyXLength
  /** The amount of columns in the document. */
  columns?: number
}

/** An object representing an entire TyX document. Saved in `.tyx` files. */
export interface TyXDocument {
  /** The version of TyX in which the document was created. */
  version: string
  /** Raw Typst code to insert before the content. */
  preamble?: string
  /** The filename of the document, unused. */
  filename?: string
  /** The serialized content of the editor. */
  content?: SerializedEditorState<SerializedLexicalNode>
  /** Whether the document has been modified since loading, unused. */
  dirty?: boolean
  /** The document's settings. */
  settings?: TyXDocumentSettings
}

export const TyXSettings = z.object({
  /** The UI Language for the app. */
  language: z.string().optional(),
  /** An array of pairs of [shortcut, command] of keyboard shortcuts. */
  keyboardShortcuts: z.array(z.tuple([z.string(), z.string()])).optional(),
  /** The keyboard map for the app. */
  keyboardMap: z.string().nullable().optional(),
  /** An array of pairs of [shortcut, command] of LaTeX inline math replacements. */
  mathInlineShortcuts: z.array(z.tuple([z.string(), z.string()])).optional(),
  /** Whether to format the output Typst documents. */
  format: z.boolean().optional(),
  /** Whether to automatically start a server that updates the PDF when the document changes. */
  autoStartServer: z.boolean().optional(),
  /** The amount in milliseconds to debounce before updating the PDF. */
  serverDebounce: z.number().optional(),
})
export const DEFAULT_SERVER_DEBOUNCE_MILLISECONDS = 500

export type TyXSettings = z.infer<typeof TyXSettings>

// TODO: perhaps support "global" commands, such as switching between documents etc.
/** The type of TyX commands which can be executed on the current document. */
export type TyXCommand = [string, ...any]
