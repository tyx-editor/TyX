/**
 * @file A compiler from TyX's Lexical content to Typst.
 */

import { SerializedListItemNode } from "@lexical/list"
import { ElementFormatType, TEXT_TYPE_TO_FORMAT } from "lexical"
import { tex2typst } from "tex2typst"
import { TyXNode, TyXTableRowNode, TyXValue } from "../models"
import tyxValue2typst from "./tyxValue2typst"

export const convertCSSColor = (color: string) => {
  const context = document.createElement("canvas").getContext("2d")!
  context.fillStyle = color
  return context.fillStyle
}

export const lexical2text = (node: TyXNode) => {
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
  direction: "ltr" | "rtl" | null | undefined,
) => {
  if (!direction) {
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
    result = `#strong[${result}]`
  }
  if (format & TEXT_TYPE_TO_FORMAT["italic"]) {
    result = `#emph[${result}]`
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

export const stringifyFunction = (
  name: string,
  positionParameters: TyXValue[] | undefined,
  namedParameters: Record<string, TyXValue> | undefined,
  includeContent = true,
) => {
  const parameters: string[] = []
  parameters.push(
    ...(positionParameters ?? [])
      .filter((value) => includeContent || value.type !== "content")
      .map(tyxValue2typst)
      .filter((parameter) => parameter !== undefined),
  )

  parameters.push(
    ...Object.keys(namedParameters ?? {})
      .sort()
      .map((parameterName) => {
        const value = tyxValue2typst(namedParameters![parameterName])
        if (value === undefined) {
          return undefined
        }
        return `${parameterName}: ${value}`
      })
      .filter((parameter) => parameter !== undefined),
  )

  return `${name}(${parameters.join(", ")})`
}

export const children2typst = (items: TyXNode[]): string => {
  let result = ""
  const translated = items.map(lexical2typst)
  for (let i = 0; i < translated.length; i++) {
    result += translated[i]
    // Add a paragraph break for any paragraph which isn't the final child.
    if (items[i].type === "paragraph" && i !== translated.length - 1) {
      result += "\n\n"
    }
  }
  return result
}

export const converters: {
  [K in TyXNode["type"]]: (d: TyXNode & { type: K }) => string
} = {
  root: (root) => {
    let result = children2typst(root.children)
    result = applyDirection(result, root.direction)
    return result
  },
  paragraph: (paragraph) => {
    let result = children2typst(paragraph.children)
    result = applyFormat(result, paragraph.format)
    result = applyDirection(result, paragraph.direction)
    return result
  },
  text: (text) => {
    let result = typstEscape(text.text)
    result = applyTextFormat(result, text.text, text.format)
    return result
  },
  math: (math) => {
    let result = tex2typst(math.expandedFormula ?? math.formula ?? "", {
      customTexMacros: { "\\differentialD": "\\text{d}" },
    })
      .trim()
      .replaceAll("placeholder", "#sym.space")
    if (math.inline) {
      result = `$${result}$`
    } else {
      result = `$ ${result} $`
    }
    return result
  },
  listitem: (item) => {
    return children2typst(item.children)
  },
  list: (list) => {
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
  quote: (quote) => {
    let result = `#quote(block: true)[${children2typst(quote.children)}]`
    result = applyDirection(result, quote.direction) + "\n"
    return result
  },
  code: (code) => {
    return `#text(dir: ltr)[#raw(block: true, lang: ${JSON.stringify(code.language ?? "none")}, ${JSON.stringify(lexical2text(code))})]`
  },
  table: (table) => {
    const row = table.children[0] as TyXTableRowNode
    const columns = new Array(row.children.length).fill("1fr").join(", ")
    let result = `#table(columns: (${columns}), ${table.children.map(lexical2typst).join(", ")})`
    result = applyDirection(result, table.direction)
    return result
  },
  tablerow: (tableRow) => {
    return tableRow.children.map(lexical2typst).join(", ")
  },
  tablecell: (tableCell) => {
    let result = children2typst(tableCell.children)
    result = applyDirection(result, tableCell.direction)
    return `[${result}]`
  },
  linebreak: () => "\\ \n",
  horizontalrule: () => "#line(length: 100%)\n",
  typstcode: (typstCode) => {
    const root = typstCode.text?.editorState.root
    return root ? lexical2text(root) : ""
  },
  image: (image) => {
    return `#image(${JSON.stringify(image.src)})`
  },
  link: (link) => {
    return `#link(${JSON.stringify(link.url)})[${children2typst(link.children)}]`
  },
  heading: (heading) => {
    return `#heading(level: ${parseInt(heading.tag[1], 10)})[${children2typst(heading.children)}]`
  },
  functioncall: (functioncall) => {
    return `#${stringifyFunction(functioncall.name!, functioncall.positionParameters, functioncall.namedParameters)}`
  },
}

export const typstEscape = (text: string) => {
  return text.replace(
    /[#=[]$\*_`@<-\+\/\\'"~]/g,
    (character) => "\\" + character,
  )
}

const lexical2typst = (d: TyXNode): string => {
  if (!d.type) {
    throw Error("Invalid Lexical document, element does not contain type!")
  }

  const converter = converters[d.type] as (d: TyXNode) => string
  if (!converter) {
    throw Error(`Unsupported Lexical type '${d.type}'`)
  }

  return converter(d)
}

export default lexical2typst
