/**
 * @file A utility file containing all serialized item types.
 */

import { SerializedCodeNode } from "@lexical/code"
import { SerializedLinkNode } from "@lexical/link"
import { SerializedListItemNode, SerializedListNode } from "@lexical/list"
import { SerializedHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { SerializedHeadingNode, SerializedQuoteNode } from "@lexical/rich-text"
import {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from "@lexical/table"
import {
  SerializedLexicalNode,
  SerializedLineBreakNode,
  SerializedParagraphNode,
  SerializedRootNode,
  SerializedTextNode,
} from "lexical"
import { SerializedImageNode } from "./components/plugins/image"
import { SerializedMathNode } from "./components/plugins/math"
import { SerializedTypstCodeNode } from "./components/plugins/typstCode"

export type Root = SerializedRootNode<SerializedLexicalNode>
export type Paragraph = SerializedParagraphNode
export type Text = SerializedTextNode
export type Math = SerializedMathNode
export type ListItem = SerializedListItemNode
export type List = SerializedListNode
export type Quote = SerializedQuoteNode
export type Code = SerializedCodeNode
export type Table = SerializedTableNode
export type TableRow = SerializedTableRowNode
export type TableCell = SerializedTableCellNode
export type LineBreak = SerializedLineBreakNode
export type HorizontalRule = SerializedHorizontalRuleNode
export type TypstCode = SerializedTypstCodeNode
export type Image = SerializedImageNode
export type Link = SerializedLinkNode
export type Heading = SerializedHeadingNode
