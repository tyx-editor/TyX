/**
 * @file TypeScript models used for TyX documents.
 */

import { z } from "zod/v4"
import { TyXNode } from "./content"
import { FunctionDefinition } from "./functions"
import { TyXLength } from "./values"

export const TyXCompilationOptions = z
  .object({
    root: z
      .string()
      .optional()
      .describe("The root directory for the Typst compiler."),
    fontPaths: z
      .array(z.string())
      .optional()
      .describe("Additional font paths for the Typst compiler."),
  })
  .describe("Compilation options passed to the Typst compiler.")
  .meta({ id: "TyXCompilationOptions" })
export type TyXCompilationOptions = z.infer<typeof TyXCompilationOptions>

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
  .describe(
    "An object wrapping some common Typst document configuration options.",
  )
  .meta({ id: "TyXDocumentSettings" })
export type TyXDocumentSettings = z.infer<typeof TyXDocumentSettings>

export const TyXDocumentContent = z
  .object({ root: TyXNode })
  .describe("The serialized content of the editor.")
  .meta({ id: "TyXDocumentContent" })
export type TyXDocumentContent = z.infer<typeof TyXDocumentContent>

export const TyXDocument = z
  .object({
    $schema: z.string().optional(),
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
    content: TyXDocumentContent.optional(),
    dirty: z
      .boolean()
      .optional()
      .describe(
        "Whether the document has been modified since loading, unused.",
      ),
    settings: TyXDocumentSettings.optional().describe(
      "The document's settings.",
    ),
  })
  .describe(
    "An object representing an entire TyX document. Saved in `.tyx` files.",
  )
  .meta({ id: "TyXDocument" })
export type TyXDocument = z.infer<typeof TyXDocument>
