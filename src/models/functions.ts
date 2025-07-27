/**
 * @file TypeScript models for TyX function definitions.
 */

import { z } from "zod/v4"

export const ParameterDescription = z
  .object({
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
  .describe("TyX specification for a function parameter.")
  .meta({ id: "ParameterDescription" })
export type ParameterDescription = z.infer<typeof ParameterDescription>

export const FunctionDefinition = z
  .object({
    positional: z
      .array(ParameterDescription)
      .optional()
      .describe("Positional arguments to the function."),
    named: z
      .array(ParameterDescription.extend({ name: z.string() }))
      .optional()
      .describe("Named arguments to the function."),
    inline: z
      .boolean()
      .optional()
      .describe("Whether TyX should display the function as inline."),
  })
  .describe("TyX specification for a Typst function.")
  .meta({ id: "FunctionDefinition" })
export type FunctionDefinition = z.infer<typeof FunctionDefinition>
