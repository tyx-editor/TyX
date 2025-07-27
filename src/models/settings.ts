/**
 * @file TypeScript models for TyX app-wide settings.
 */

import { z } from "zod/v4"
import { FunctionDefinition } from "./functions"

export const TyXSettings = z
  .object({
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
  .describe("App-wide customization for TyX.")
  .meta({ id: "TyXSettings" })
export const DEFAULT_SERVER_DEBOUNCE_MILLISECONDS = 500

export type TyXSettings = z.infer<typeof TyXSettings>
