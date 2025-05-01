import { JSONContent } from "@tiptap/react"

export const converters: Record<string, (d: JSONContent) => string> = {
  doc: (d) => {
    return d.content?.map(tiptap2typst).join("") ?? ""
  },
  paragraph: (d) => {
    let result = (d.content?.map(tiptap2typst).join("") ?? "#box[]") + "\n\n"
    if (d.attrs?.textAlign && d.attrs.textAlign !== "justify") {
      result = `#align(${d.attrs.textAlign})[${result}]`
    }
    return result
  },
  text: (d) => {
    let text = typstEscape(d.text ?? "")
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
      }
      if (mark.type === "link") {
        let href = mark.attrs?.href ?? ""
        if (href !== "" && !href.includes("://")) {
          href = "https://" + href
        }
        text = `#link(${JSON.stringify(href)})[${text}]`
      }
    }

    return text
  },
  bulletList: (d) => {
    return (
      "#list(" +
      d.content?.map(
        (child) => `list.item[${child.content?.map(tiptap2typst).join("\n\n")}]`
      ) +
      ")"
    )
  },
  orderedList: (d) => {
    return (
      "#enum(" +
      d.content?.map(
        (child) => `enum.item[${child.content?.map(tiptap2typst).join("\n\n")}]`
      ) +
      ")"
    )
  },
  table: (d) => {
    const columnCount = d.content![0].content!.length
    return (
      `#table(columns: ${columnCount} * (1fr,),` +
      d.content
        ?.map((child) =>
          child.content
            ?.map((child) => "[" + tiptap2typst(child) + "]")
            .join(",")
        )
        .join(",") +
      ")"
    )
  },
  tableCell: (d) => {
    return d.content?.map(tiptap2typst).join("") ?? ""
  },
}

export const typstEscape = (text: string) => {
  return "#" + JSON.stringify(text)
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
