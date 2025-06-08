import { Link } from "@mantine/tiptap"
import type { SingleCommands } from "@tiptap/core"
import { Blockquote } from "@tiptap/extension-blockquote"
import { Bold } from "@tiptap/extension-bold"
import { BulletList } from "@tiptap/extension-bullet-list"
import { Code } from "@tiptap/extension-code"
import { CodeBlock } from "@tiptap/extension-code-block"
import { Color } from "@tiptap/extension-color"
import { Document } from "@tiptap/extension-document"
import { Dropcursor } from "@tiptap/extension-dropcursor"
import { Gapcursor } from "@tiptap/extension-gapcursor"
import { HardBreak } from "@tiptap/extension-hard-break"
import { Heading } from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import { History } from "@tiptap/extension-history"
import { HorizontalRule } from "@tiptap/extension-horizontal-rule"
import { Image } from "@tiptap/extension-image"
import { Italic } from "@tiptap/extension-italic"
import { ListItem } from "@tiptap/extension-list-item"
import { OrderedList } from "@tiptap/extension-ordered-list"
import { Paragraph } from "@tiptap/extension-paragraph"
import { Strike } from "@tiptap/extension-strike"
import SubScript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import { Text } from "@tiptap/extension-text"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import TextDirectionX from "tiptap-text-direction"
import KeyboardMap from "./KeyboardMapExtension"
import { MathBlock, MathInline } from "./MathEditorExtension"
import { TypstCode } from "./TypstCodeExtension"

let TextDirection = TextDirectionX

// @ts-ignore
if (TextDirection.default) {
  // @ts-ignore
  TextDirection = TextDirection.default
}

const withoutShortcuts = (extension: any) => {
  return (
    extension.extend?.({
      addKeyboardShortcuts() {
        return {}
      },
    }) || extension
  )
}

const extensions = [
  Bold,
  Blockquote,
  BulletList,
  Code,
  CodeBlock,
  Document,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Heading,
  History,
  HorizontalRule,
  Italic,
  ListItem,
  OrderedList,
  Paragraph,
  Strike,
  Text,
  TextStyle.configure({ mergeNestedSpanStyles: true }),
  Color,
  Superscript,
  SubScript,
  Underline,
  Link,
  Highlight,
  TextAlign.configure({
    types: ["heading", "paragraph"],
    defaultAlignment: "",
  }),
  TextDirection.configure({
    types: ["heading", "paragraph"],
    defaultDirection: "ltr",
  }),
  Table.configure({ resizable: false }),
  TableRow,
  TableCell,
  TableHeader,
  Image,
  MathBlock,
  MathInline,
  TypstCode,
  KeyboardMap,
].map(withoutShortcuts)

export default extensions

export type Commands = SingleCommands
