/**
 * @file A compiler from TyX's TipTap schema to Typst.
 */

import { JSONContent } from "@tiptap/react"
import asciimath2typst from "./asciimath2typst"

export const mathConverter = (d: JSONContent, inline = false) => {
  let result = ""
  const asciimath = d.attrs?.asciimath

  if (asciimath) {
    result = asciimath2typst(asciimath)
  }

  if (inline) {
    return `$${result}$`
  } else {
    return `$ ${result} $`
  }
}

export const convertCSSColor = (color: string) => {
  const context = document.createElement("canvas").getContext("2d")!
  context.fillStyle = color
  return context.fillStyle
}

export const applyTextAlignAndDirection = (result: string, d: JSONContent) => {
  if (d.attrs?.textAlign && d.attrs.textAlign !== "justify") {
    result = `#align(${d.attrs.textAlign})[${result}]`
  }
  if (d.attrs?.dir) {
    result = `#text(dir: ${d.attrs.dir})[${result}]`
  }
  return result
}

export const converters: Record<string, (d: JSONContent) => string> = {
  doc: (d) => {
    return d.content?.map(tiptap2typst).join("") ?? ""
  },
  paragraph: (d) => {
    let result = d.content?.map(tiptap2typst).join("") ?? "#box[]"
    result = applyTextAlignAndDirection(result, d)
    return result + "\n#parbreak()\n"
  },
  text: (d) => {
    let text = typstEscape(d.text ?? "")
    if (d.marks?.some((mark) => mark.type === "code")) {
      text = `#raw(${text.slice(1)})`
    } else {
      if (d.marks?.some((mark) => mark.type === "typstCode")) {
        return `\n${tiptap2text(d)}\n`
      }

      for (const mark of d.marks ?? []) {
        if (mark.type === "bold") {
          text = `*${text}*`
        } else if (mark.type === "italic") {
          text = `_${text}_`
        } else if (mark.type === "underline") {
          text = `#underline[${text}]`
        } else if (mark.type === "highlight") {
          text = `#highlight[${text}]`
        } else if (mark.type === "strike") {
          text = `#strike[${text}]`
        } else if (mark.type === "link") {
          let href = mark.attrs?.href ?? ""
          if (href !== "" && !href.includes("://")) {
            href = "https://" + href
          }
          text = `#link(${JSON.stringify(href)})[${text}]`
        } else if (mark.type === "subscript") {
          text = `#sub[${text}]`
        } else if (mark.type === "superscript") {
          text = `#super[${text}]`
        } else if (mark.type === "textStyle") {
          for (const key in mark.attrs ?? {}) {
            if (key === "color") {
              const color = convertCSSColor(mark.attrs!.color)
              if (color !== "#000000") {
                text = `#text(rgb(${JSON.stringify(convertCSSColor(mark.attrs!.color))}))[${text}]`
              }
            } else {
              throw Error(`Unsupported text style "${key}"`)
            }
          }
        } else {
          throw Error(`Unsupported mark "${mark.type}"`)
        }
      }
    }

    return text
  },
  bulletList: (d) => {
    return (
      "#list(" +
      d.content?.map(
        (child) =>
          `list.item[\n${child.content?.map(tiptap2typst).join("\n\n").trim()}\n]`,
      ) +
      ")\n"
    )
  },
  orderedList: (d) => {
    return (
      "#enum(" +
      d.content?.map(
        (child) =>
          `enum.item[\n${child.content?.map(tiptap2typst).join("\n\n").trim()}\n]`,
      ) +
      ")\n"
    )
  },
  table: (d) => {
    const columnCount = d.content![0].content!.length
    return (
      `#text(dir: ltr)[#table(columns: ${columnCount} * (1fr,),` +
      d.content
        ?.map((child) =>
          child.content
            ?.map((child) => "[" + tiptap2typst(child) + "]")
            .join(","),
        )
        .join(",") +
      ")]\n"
    )
  },
  tableCell: (d) => {
    return d.content?.map(tiptap2typst).join("") ?? ""
  },
  codeBlock: (d) => {
    return `#raw(lang: ${d.attrs?.language ? JSON.stringify(d.attrs.language) : "none"}, ${JSON.stringify(tiptap2text(d))})`
  },
  hardBreak: () => {
    return "#linebreak()"
  },
  heading: (d) => {
    let result = `#heading(level: ${d.attrs?.level ?? 1})[${d.content
      ?.map(tiptap2typst)
      .join("")}]`
    result = applyTextAlignAndDirection(result, d)
    return result
  },
  blockquote: (d) => {
    return `#quote(block: true)[\n${d.content?.map(tiptap2typst).join("").trim()}\n]\n`
  },
  horizontalRule: () => {
    return `#line(length: 100%)`
  },
  mathInline: (d) => mathConverter(d, true),
  mathBlock: (d) => mathConverter(d) + "\n",
  image: (d) => `#image(${JSON.stringify(d.attrs?.alt ?? "")})`,
}

export const typstEscape = (text: string) => {
  return text.replace(
    /[#=\[\]$*_`@<\-\+\/\\'"~]/g,
    (character) => "\\" + character,
  )
}

export const tiptap2text = (d: JSONContent) => {
  let text = d.text ?? ""
  for (const child of d.content ?? []) {
    text += tiptap2text(child)
  }
  return text
}

const tiptap2typst = (d: JSONContent): string => {
  if (!d.type) {
    throw Error("Invalid TipTap document, element does not contain type!")
  }

  const converter = converters[d.type]
  if (!converter) {
    throw Error(`Unsupported TipTap type '${d.type}'`)
  }

  return converter(d)
}

export default tiptap2typst
