/**
 * @file TypeScript models used by TyX.
 */

import { SerializedLexicalNode, SerializedRootNode } from "lexical"
import { z } from "zod/v4"

export const ParameterDescription = z.object({
  type: z.string().describe("The TyX type of this parameter."),
  required: z
    .boolean()
    .optional()
    .describe("Whether this parameter is required."),
  label: z
    .string()
    .optional()
    .describe("Optional label (usually name) of this parameter."),
  documentation: z
    .string()
    .optional()
    .describe("Optional documentation for this parameter to show on hover."),
})
export type ParameterDescription = z.infer<typeof ParameterDescription>

export const FunctionDefinition = z.object({
  positional: z.array(ParameterDescription).optional(),
  named: z.array(ParameterDescription.extend({ name: z.string() })).optional(),
})
export type FunctionDefinition = z.infer<typeof FunctionDefinition>

/** An object representing any TyX value (which in turn, represents some Typst value) */
export type TyXValue = TyXLengthValue | TyXBooleanValue | TyXContentValue

export type TyXLengthValue = TyXLength & { type: "length" }

/** An object representing Typst `relative` or `fraction` types. */
export const TyXLength = z.object({
  unit: z.string().optional(),
  value: z.string().optional(),
})
export type TyXLength = z.infer<typeof TyXLength>

/** An object representing Typst `bool` type. */
export const TyXBoolean = z.object({
  type: z.literal("boolean"),
  value: z.boolean().optional(),
})
export type TyXBooleanValue = z.infer<typeof TyXBoolean>

/** An object representing Typst `content` type. */
export interface TyXContentValue {
  type: "content"
  value?: SerializedRootNode<SerializedLexicalNode>
}

/** Compilation options passed to the Typst compiler. */
export const TyXCompilationOptions = z.object({
  root: z.string().optional(),
  fontPaths: z.array(z.string()).optional(),
})
export type TyXCompilationOptions = z.infer<typeof TyXCompilationOptions>

/** An object wrapping some common Typst document configuration options. */
export const TyXDocumentSettings = TyXCompilationOptions.extend({
  language: z.string().optional().describe("The language of the document."),
  paper: z.string().optional().describe("The paper size of the document."),
  flipped: z
    .boolean()
    .optional()
    .describe("Whether the document's page is flipped."),
  justified: z
    .boolean()
    .optional()
    .describe("Whether the document's text is justified."),
  indentation: TyXLength.optional().describe(
    "Optional indentation for paragraphs in the document.",
  ),
  columns: z
    .number()
    .optional()
    .describe("The amount of columns in the document."),
  functions: z
    .record(z.string(), FunctionDefinition)
    .optional()
    .describe("Additional TyX function definitions."),
})
export type TyXDocumentSettings = z.infer<typeof TyXDocumentSettings>

/** An object representing an entire TyX document. Saved in `.tyx` files. */
export const TyXDocument = z.object({
  version: z
    .string()
    .describe("The version of TyX in which the document was created."),
  preamble: z
    .string()
    .optional()
    .describe("Raw Typst code to insert before the content."),
  filename: z
    .string()
    .optional()
    .describe("The filename of the document, unused."),
  content: z.any().optional().describe("The serialized content of the editor."),
  dirty: z
    .boolean()
    .optional()
    .describe("Whether the document has been modified since loading, unused."),
  settings: TyXDocumentSettings.optional().describe("The document's settings."),
})
export type TyXDocument = z.infer<typeof TyXDocument>

export const TyXSettings = z.object({
  language: z.string().optional().describe("The UI Language for the app."),
  keyboardShortcuts: z
    .array(z.tuple([z.string(), z.string()]))
    .optional()
    .describe(
      "An array of pairs of [shortcut, command] of keyboard shortcuts.",
    ),
  keyboardMap: z
    .string()
    .nullable()
    .optional()
    .describe("The keyboard map for the app."),
  mathInlineShortcuts: z
    .array(z.tuple([z.string(), z.string()]))
    .optional()
    .describe(
      "An array of pairs of [shortcut, command] of LaTeX inline math replacements.",
    ),
  format: z
    .boolean()
    .optional()
    .describe("Whether to format the output Typst documents."),
  autoStartServer: z
    .boolean()
    .optional()
    .describe(
      "Whether to automatically start a server that updates the PDF when the document changes.",
    ),
  serverDebounce: z
    .number()
    .optional()
    .describe(
      "The amount in milliseconds to debounce before updating the PDF.",
    ),
  functions: z
    .record(z.string(), FunctionDefinition)
    .optional()
    .describe("Additional TyX function definitions."),
})
export const DEFAULT_SERVER_DEBOUNCE_MILLISECONDS = 500

export type TyXSettings = z.infer<typeof TyXSettings>

// TODO: perhaps support "global" commands, such as switching between documents etc.
/** The type of TyX commands which can be executed on the current document. */
export type TyXCommand = [string, ...any]
