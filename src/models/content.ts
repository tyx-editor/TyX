/**
 * @file TypeScript models used for TyX document content, based on Lexical.
 */

import { z } from "zod/v4"
import { TyXValue } from "./values"

export const TyXDirectionValue = z
  .union([z.literal("ltr"), z.literal("rtl")])
  .describe("Possible direction values of text in TyX.")
  .meta({ id: "TyXDirectionValue" })

export const TyXDirection = TyXDirectionValue.nullable()
  .optional()
  .describe("A direction of text in TyX.")
  .meta({ id: "TyXDirection" })
export type TyXDirection = z.infer<typeof TyXDirection>

export const TyXEditorState = z.looseObject({
  editorState: z.looseObject({
    get root() {
      return TyXRootNode
    },
  }),
})
export type TyXEditorState = z.infer<typeof TyXEditorState>

export const TyXElementFormat = z.union([
  z.literal("left"),
  z.literal("start"),
  z.literal("center"),
  z.literal("right"),
  z.literal("end"),
  z.literal("justify"),
  z.literal(""),
])
export type TyXElementFormat = z.infer<typeof TyXElementFormat>

export const TyXRootNode = z
  .looseObject({
    type: z.literal("root"),
    get children() {
      return z.array(TyXNode)
    },
    direction: TyXDirection,
  })
  .describe("The node at the root of a TyX document.")
  .meta({ id: "TyXRootNode" })
export type TyXRootNode = z.infer<typeof TyXRootNode>

export const TyXParagraphNode = z
  .looseObject({
    type: z.literal("paragraph"),
    get children() {
      return z.array(TyXNode)
    },
    format: TyXElementFormat,
    direction: TyXDirection,
  })
  .describe("A node describing a paragraph.")
  .meta({ id: "TyXParagraphNode" })
export type TyXParagraphNode = z.infer<typeof TyXParagraphNode>

export const TyXTextNode = z
  .looseObject({
    type: z.literal("text"),
    text: z.string(),
    format: z.int(),
  })
  .describe("A node describing text.")
  .meta({ id: "TyXTextNode" })
export type TyXTextNode = z.infer<typeof TyXTextNode>

export const TyXMathNode = z
  .looseObject({
    type: z.literal("math"),
    typst: z.string().optional(),
    formula: z.string().optional(),
    inline: z.boolean().optional(),
  })
  .describe("A node describing a math equation.")
  .meta({ id: "TyXMathNode" })
export type TyXMathNode = z.infer<typeof TyXMathNode>

export const TyXListItemNode = z
  .looseObject({
    type: z.literal("listitem"),
    value: z.int(),
    get children() {
      return z.array(TyXNode)
    },
  })
  .describe("A node describing a list item.")
  .meta({ id: "TyXListItemNode" })
export type TyXListItemNode = z.infer<typeof TyXListItemNode>

export const TyXListNode = z
  .looseObject({
    type: z.literal("list"),
    get children() {
      return z.array(TyXNode)
    },
    listType: z.union([
      z.literal("bullet"),
      z.literal("number"),
      z.literal("check"),
    ]),
    start: z.int(),
    direction: TyXDirection,
  })
  .describe("A node describing a bullet or numbered list.")
  .meta({ id: "TyXListNode" })
export type TyXListNode = z.infer<typeof TyXListNode>

export const TyXQuoteNode = z
  .looseObject({
    type: z.literal("quote"),
    get children() {
      return z.array(TyXNode)
    },
    direction: TyXDirection,
  })
  .describe("A node describing a block quote.")
  .meta({ id: "TyXQuoteNode" })
export type TyXQuoteNode = z.infer<typeof TyXQuoteNode>

export const TyXCodeNode = z
  .looseObject({
    type: z.literal("code"),
    get children() {
      return z.array(TyXNode)
    },
    language: z.string().optional(),
  })
  .describe("A node describing a code block.")
  .meta({ id: "TyXCodeNode" })
export type TyXCodeNode = z.infer<typeof TyXCodeNode>

export const TyXTableNode = z
  .looseObject({
    type: z.literal("table"),
    get children() {
      return z.array(TyXNode)
    },
    direction: TyXDirection,
  })
  .describe("A node describing a table.")
  .meta({ id: "TyXTableNode" })
export type TyXTableNode = z.infer<typeof TyXTableNode>

export const TyXTableRowNode = z
  .looseObject({
    type: z.literal("tablerow"),
    get children() {
      return z.array(TyXNode)
    },
  })
  .describe("A node describing a table row.")
  .meta({ id: "TyXTableRowNode" })
export type TyXTableRowNode = z.infer<typeof TyXTableRowNode>

export const TyXTableCellNode = z
  .looseObject({
    type: z.literal("tablecell"),
    get children() {
      return z.array(TyXNode)
    },
    direction: TyXDirection,
  })
  .describe("A node describing a table cell.")
  .meta({ id: "TyXTableCellNode" })
export type TyXTableCellNode = z.infer<typeof TyXTableCellNode>

export const TyXLineBreakNode = z
  .looseObject({
    type: z.literal("linebreak"),
  })
  .describe("A line break node.")
  .meta({ id: "TyXLineBreakNode" })
export type TyXLineBreakNode = z.infer<typeof TyXLineBreakNode>

export const TyXHorizontalRuleNode = z
  .looseObject({
    type: z.literal("horizontalrule"),
  })
  .describe("A horizontal rule node.")
  .meta({ id: "TyXHorizontalRuleNode" })
export type TyXHorizontalRuleNode = z.infer<typeof TyXHorizontalRuleNode>

export const TyXTypstCodeNode = z
  .looseObject({
    type: z.literal("typstcode"),
    text: TyXEditorState,
  })
  .describe("A raw Typst code node.")
  .meta({ id: "TyXTypstCodeNode" })
export type TyXTypstCodeNode = z.infer<typeof TyXTypstCodeNode>

export const TyXImageNode = z
  .looseObject({
    type: z.literal("image"),
    src: z.string(),
  })
  .describe("An image node.")
  .meta({ id: "TyXImageNode" })
export type TyXImageNode = z.infer<typeof TyXImageNode>

export const TyXLinkNode = z
  .looseObject({
    type: z.literal("link"),
    get children() {
      return z.array(TyXNode)
    },
    url: z.string(),
  })
  .describe("A link node.")
  .meta({ id: "TyXLinkNode" })
export type TyXLinkNode = z.infer<typeof TyXLinkNode>

export const TyXHeadingNode = z
  .looseObject({
    type: z.literal("heading"),
    tag: z.union([
      z.literal("h1"),
      z.literal("h2"),
      z.literal("h3"),
      z.literal("h4"),
      z.literal("h5"),
      z.literal("h6"),
    ]),
    get children() {
      return z.array(TyXNode)
    },
  })
  .describe("A heading node.")
  .meta({ id: "TyXHeadingNode" })
export type TyXHeadingNode = z.infer<typeof TyXHeadingNode>

export const TyXFunctionCallNode = z
  .looseObject({
    type: z.literal("functioncall"),
    name: z.string().optional(),
    positionParameters: z.array(TyXValue).optional(),
    namedParameters: z.record(z.string(), TyXValue).optional(),
  })
  .describe("A function call node.")
  .meta({ id: "TyXFunctionCallNode" })
export type TyXFunctionCallNode = z.infer<typeof TyXFunctionCallNode>

export const TyXNode = z
  .union([
    TyXRootNode,
    TyXParagraphNode,
    TyXTextNode,
    TyXMathNode,
    TyXListItemNode,
    TyXListNode,
    TyXCodeNode,
    TyXQuoteNode,
    TyXTableNode,
    TyXTableRowNode,
    TyXTableCellNode,
    TyXLineBreakNode,
    TyXHorizontalRuleNode,
    TyXTypstCodeNode,
    TyXImageNode,
    TyXLinkNode,
    TyXHeadingNode,
    TyXFunctionCallNode,
  ])
  .describe("Some TyX node.")
  .meta({ id: "TyXNode" })
export type TyXNode = z.infer<typeof TyXNode>
