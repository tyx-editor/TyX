/**
 * @file A compiler from TyX's Lexical content to Typst.
 */

import { SerializedCodeNode } from "@lexical/code"
import { SerializedListItemNode, SerializedListNode } from "@lexical/list"
import { SerializedQuoteNode } from "@lexical/rich-text"
import {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from "@lexical/table"
import {
  ElementFormatType,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedRootNode,
  SerializedTextNode,
  TEXT_TYPE_TO_FORMAT,
} from "lexical"
import { SerializedMathNode } from "../components/plugins/MathPlugin"
import asciimath2typst from "./asciimath2typst"

export const convertCSSColor = (color: string) => {
  const context = document.createElement("canvas").getContext("2d")!
  context.fillStyle = color
  return context.fillStyle
}

export const lexical2text = (node: SerializedLexicalNode) => {
  const some = node as any
  if (typeof some?.text === "string") {
    return some.text
  }

  if (node.type === "linebreak") {
    return "\n"
  }

  if (some?.children) {
    return some.children.map(lexical2text).join("")
  }
}

export const applyDirection = (
  result: string,
  direction: "ltr" | "rtl" | null,
) => {
  if (direction === null) {
    return result
  }

  return `#text(dir: ${direction})[${result}]`
}

export const applyTextFormat = (
  result: string,
  text: string,
  format: number,
) => {
  if (format & TEXT_TYPE_TO_FORMAT["bold"]) {
    result = `*${result}*`
  }
  if (format & TEXT_TYPE_TO_FORMAT["italic"]) {
    result = `_${result}_`
  }
  if (format & TEXT_TYPE_TO_FORMAT["underline"]) {
    result = `#underline[${result}]`
  }
  if (format & TEXT_TYPE_TO_FORMAT["strikethrough"]) {
    result = `#strike[${result}]`
  }
  if (format & TEXT_TYPE_TO_FORMAT["subscript"]) {
    result = `#sub[${result}]`
  }
  if (format & TEXT_TYPE_TO_FORMAT["superscript"]) {
    result = `#super[${result}]`
  }
  if (format & TEXT_TYPE_TO_FORMAT["code"]) {
    return `#raw(${JSON.stringify(text)})`
  }

  return result
}

export const applyFormat = (result: string, format: ElementFormatType) => {
  if (format === "justify") {
    return `#par(justify: true)[${result}]`
  } else if (
    format === "left" ||
    format === "center" ||
    format == "right" ||
    format == "start" ||
    format == "end"
  ) {
    return `#align(${format})[${result}]`
  }

  return result
}

export const converters: Record<string, (d: SerializedLexicalNode) => string> =
  {
    root: (d) => {
      const root = d as SerializedRootNode<SerializedLexicalNode>
      return root.children.map(lexical2typst).join("")
    },
    paragraph: (d) => {
      const paragraph = d as SerializedParagraphNode
      let result = paragraph.children.map(lexical2typst).join("")
      result = applyFormat(result, paragraph.format)
      result = applyDirection(result, paragraph.direction)
      return result + "\n#parbreak()\n"
    },
    text: (d) => {
      const text = d as SerializedTextNode
      let result = typstEscape(text.text)
      result = applyTextFormat(result, text.text, text.format)
      return result
    },
    math: (d) => {
      const math = d as SerializedMathNode
      let result = asciimath2typst(math.asciimath ?? "")
      if (math.inline) {
        result = `$${result}$`
      } else {
        result = `$ ${result} $`
      }
      return result
    },
    listitem: (d) => {
      const item = d as SerializedListItemNode
      return item.children.map(lexical2typst).join("")
    },
    list: (d) => {
      const list = d as SerializedListNode
      let result = ""

      if (list.listType === "bullet") {
        result = "\n#list("
      } else if (list.listType === "number") {
        result = `\n#enum(start: ${list.start},`
      }

      for (let i = 0; i < list.children.length - 1; i++) {
        result += `[${lexical2typst(list.children[i])}]`
        if (
          list.children[i + 1].type === "listitem" &&
          (list.children[i + 1] as SerializedListItemNode).children[0]?.type ===
            "list"
        ) {
          result += " + "
        } else {
          result += ", "
        }
      }
      if (list.children.length > 0) {
        result += `[${lexical2typst(list.children[list.children.length - 1])}]`
      }
      result += ")\n"

      result = applyDirection(result, list.direction)
      return result
    },
    quote: (d) => {
      const quote = d as SerializedQuoteNode
      let result = `#quote(block: true)[${quote.children.map(lexical2typst).join("")}]`
      result = applyDirection(result, quote.direction) + "\n"
      return result
    },
    code: (d) => {
      const code = d as SerializedCodeNode
      return `#raw(block: true, lang: ${JSON.stringify(code.language ?? "none")}, ${JSON.stringify(lexical2text(code))})`
    },
    table: (d) => {
      const table = d as SerializedTableNode
      console.log(table)
      const columns = new Array(table.children.length).fill("1fr").join(", ")
      let result = `#table(columns: (${columns}), ${table.children.map(lexical2typst).join(", ")})`
      result = applyDirection(result, table.direction)
      return result
    },
    tablerow: (d) => {
      const tableRow = d as SerializedTableRowNode
      return tableRow.children.map(lexical2typst).join(", ")
    },
    tablecell: (d) => {
      const tableCell = d as SerializedTableCellNode
      let result = tableCell.children.map(lexical2typst).join("")
      result = applyDirection(result, tableCell.direction)
      return `[${result}]`
    },
    linebreak: () => "\\ \n",
    horizontalrule: () => "#line(length: 100%)\n",
  }

export const typstEscape = (text: string) => {
  return text.replace(
    /[#=[]$\*_`@<-\+\/\\'"~]/g,
    (character) => "\\" + character,
  )
}

const lexical2typst = (d: SerializedLexicalNode): string => {
  if (!d.type) {
    throw Error("Invalid Lexical document, element does not contain type!")
  }

  const converter = converters[d.type]
  if (!converter) {
    throw Error(`Unsupported Lexical type '${d.type}'`)
  }

  return converter(d)
}

export default lexical2typst
