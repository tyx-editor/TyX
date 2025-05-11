import { Link } from "@mantine/tiptap"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import SubScript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"
import TextDirectionX from "tiptap-text-direction"
import { MathBlock, MathInline } from "./MathEditorExtension"
import { TypstCode } from "./TypstCodeExtension"

let TextDirection = TextDirectionX

// @ts-ignore
if (TextDirection.default) {
  // @ts-ignore
  TextDirection = TextDirection.default
}

const extensions = [
  StarterKit,
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
  MathBlock,
  MathInline,
  TypstCode,
]

export default extensions
