/**
 * @file A compiler from TyX's Lexical content to Typst.
 */

import {
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

export const converters: Record<string, (d: SerializedLexicalNode) => string> =
  {
    root: (d) => {
      const root = d as SerializedRootNode<SerializedLexicalNode>
      return root.children.map(lexical2typst).join("")
    },
    paragraph: (d) => {
      const paragraph = d as SerializedParagraphNode
      let result =
        paragraph.children.map(lexical2typst).join("") + "\n#parbreak()\n"
      result = applyDirection(result, paragraph.direction)
      return result
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
  }

export const typstEscape = (text: string) => {
  return text.replace(
    /[#=\[\]$*_`@<\-\+\/\\'"~]/g,
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
