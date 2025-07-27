/**
 * @file TypeScript models used by TyX.
 */

import { z } from "zod/v4"
import { TyXRootNode } from "./content"

export const TyXLength = z.object({
  unit: z
    .string()
    .optional()
    .describe(
      "The TyX length unit, one of 'pt', 'mm', 'cm', 'in', 'em', 'fr', '%'.",
    ),
  value: z.string().optional().describe("The length numeric value."),
})
export type TyXLength = z.infer<typeof TyXLength>

export const TyXLengthValue = TyXLength.extend({
  type: z.literal("length"),
})
  .describe("An object representing Typst `relative` or `fraction` types.")
  .meta({ id: "TyXLengthValue" })
export type TyXLengthValue = z.infer<typeof TyXLengthValue>

/** An object representing Typst `bool` type. */
export const TyXBooleanValue = z
  .object({
    type: z.literal("boolean"),
    value: z.boolean().optional(),
  })
  .describe("An object representing Typst `bool` type.")
  .meta({ id: "TyXBooleanValue" })
export type TyXBooleanValue = z.infer<typeof TyXBooleanValue>

/** An object representing Typst `content` type. */
export const TyXContentValue = z.object({
  type: z.literal("content"),
  get value() {
    return TyXRootNode.optional()
  },
})
export type TyXContentValue = z.infer<typeof TyXContentValue>
// export interface TyXContentValue {
//   type: "content"
//   value?: SerializedRootNode<SerializedLexicalNode>
// }

/** An object representing any TyX value (which in turn, represents some Typst value) */
export const TyXValue = z.union([
  TyXLengthValue,
  TyXBooleanValue,
  TyXContentValue,
])
export type TyXValue = z.infer<typeof TyXValue>
