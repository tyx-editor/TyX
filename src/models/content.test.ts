import {
  TyXCodeHighlightNode,
  TyXCodeNode,
  TyXDirection,
  TyXFunctionCallNode,
  TyXHeadingNode,
  TyXHorizontalRuleNode,
  TyXImageNode,
  TyXLineBreakNode,
  TyXLinkNode,
  TyXListItemNode,
  TyXListNode,
  TyXMathNode,
  TyXNode,
  TyXParagraphNode,
  TyXQuoteNode,
  TyXRootNode,
  TyXTabNode,
  TyXTableCellNode,
  TyXTableNode,
  TyXTableRowNode,
  TyXTextNode,
  TyXTypstCodeNode,
} from "./content"

describe("TyXDirection", () => {
  it("accepts ltr", () => {
    expect(TyXDirection.parse("ltr")).toBe("ltr")
  })

  it("accepts rtl", () => {
    expect(TyXDirection.parse("rtl")).toBe("rtl")
  })

  it("accepts null", () => {
    expect(TyXDirection.parse(null)).toBeNull()
  })

  it("accepts undefined", () => {
    expect(TyXDirection.parse(undefined)).toBeUndefined()
  })

  it("rejects invalid direction", () => {
    expect(TyXDirection.safeParse("center").success).toBe(false)
  })
})

describe("TyXTextNode", () => {
  it("parses valid text node", () => {
    const result = TyXTextNode.parse({ type: "text", text: "hello", format: 0 })
    expect(result.text).toBe("hello")
    expect(result.format).toBe(0)
  })

  it("rejects wrong type discriminator", () => {
    expect(
      TyXTextNode.safeParse({ type: "paragraph", text: "hi", format: 0 })
        .success,
    ).toBe(false)
  })

  it("rejects missing text field", () => {
    expect(TyXTextNode.safeParse({ type: "text", format: 0 }).success).toBe(
      false,
    )
  })
})

describe("TyXMathNode", () => {
  it("parses math node with typst and inline", () => {
    const result = TyXMathNode.parse({
      type: "math",
      typst: "x^2",
      inline: true,
    })
    expect(result.typst).toBe("x^2")
    expect(result.inline).toBe(true)
  })

  it("parses math node with all optional fields absent", () => {
    const result = TyXMathNode.parse({ type: "math" })
    expect(result.typst).toBeUndefined()
    expect(result.inline).toBeUndefined()
  })
})

describe("TyXHeadingNode", () => {
  it("parses h1 heading", () => {
    const result = TyXHeadingNode.parse({
      type: "heading",
      tag: "h1",
      children: [],
    })
    expect(result.tag).toBe("h1")
  })

  it("parses h6 heading", () => {
    const result = TyXHeadingNode.parse({
      type: "heading",
      tag: "h6",
      children: [],
    })
    expect(result.tag).toBe("h6")
  })

  it("rejects invalid heading tag", () => {
    expect(
      TyXHeadingNode.safeParse({ type: "heading", tag: "h7", children: [] })
        .success,
    ).toBe(false)
  })
})

describe("TyXListNode", () => {
  it("parses bullet list", () => {
    const result = TyXListNode.parse({
      type: "list",
      listType: "bullet",
      children: [],
      start: 1,
    })
    expect(result.listType).toBe("bullet")
  })

  it("parses numbered list", () => {
    const result = TyXListNode.parse({
      type: "list",
      listType: "number",
      children: [],
      start: 1,
    })
    expect(result.listType).toBe("number")
  })

  it("rejects invalid listType", () => {
    expect(
      TyXListNode.safeParse({
        type: "list",
        listType: "ordered",
        children: [],
        start: 1,
      }).success,
    ).toBe(false)
  })
})

describe("TyXFunctionCallNode", () => {
  it("parses function call with no params", () => {
    const result = TyXFunctionCallNode.parse({ type: "functioncall" })
    expect(result.name).toBeUndefined()
  })

  it("parses function call with name and positional params", () => {
    const result = TyXFunctionCallNode.parse({
      type: "functioncall",
      name: "h",
      positionParameters: [{ type: "length", unit: "em", value: "1" }],
    })
    expect(result.name).toBe("h")
    expect(result.positionParameters).toHaveLength(1)
  })
})

describe("TyXParagraphNode", () => {
  it("parses paragraph with format", () => {
    const result = TyXParagraphNode.parse({
      type: "paragraph",
      children: [],
      format: "center",
    })
    expect(result.format).toBe("center")
  })
})

describe("TyXImageNode", () => {
  it("parses image node", () => {
    const result = TyXImageNode.parse({ type: "image", src: "photo.png" })
    expect(result.src).toBe("photo.png")
  })
})

describe("TyXLinkNode", () => {
  it("parses link node", () => {
    const result = TyXLinkNode.parse({
      type: "link",
      url: "https://example.com",
      children: [],
    })
    expect(result.url).toBe("https://example.com")
  })
})

describe("TyXTableNode", () => {
  it("parses table node", () => {
    const result = TyXTableNode.parse({ type: "table", children: [] })
    expect(result.type).toBe("table")
  })
})

describe("TyXTableRowNode", () => {
  it("parses table row", () => {
    const result = TyXTableRowNode.parse({ type: "tablerow", children: [] })
    expect(result.type).toBe("tablerow")
  })
})

describe("TyXTableCellNode", () => {
  it("parses table cell", () => {
    const result = TyXTableCellNode.parse({ type: "tablecell", children: [] })
    expect(result.type).toBe("tablecell")
  })
})

describe("TyXLineBreakNode", () => {
  it("parses linebreak", () => {
    const result = TyXLineBreakNode.parse({ type: "linebreak" })
    expect(result.type).toBe("linebreak")
  })
})

describe("TyXHorizontalRuleNode", () => {
  it("parses horizontalrule", () => {
    const result = TyXHorizontalRuleNode.parse({ type: "horizontalrule" })
    expect(result.type).toBe("horizontalrule")
  })
})

describe("TyXCodeNode", () => {
  it("parses code node with language", () => {
    const result = TyXCodeNode.parse({
      type: "code",
      children: [],
      language: "rust",
    })
    expect(result.language).toBe("rust")
  })

  it("parses code node without language", () => {
    const result = TyXCodeNode.parse({ type: "code", children: [] })
    expect(result.language).toBeUndefined()
  })
})

describe("TyXRootNode", () => {
  it("parses root node with children", () => {
    const result = TyXRootNode.parse({
      type: "root",
      children: [{ type: "text", text: "hello", format: 0 }],
    })
    expect(result.children).toHaveLength(1)
  })
})

describe("TyXQuoteNode", () => {
  it("parses quote node", () => {
    const result = TyXQuoteNode.parse({ type: "quote", children: [] })
    expect(result.type).toBe("quote")
  })
})

describe("TyXListItemNode", () => {
  it("parses list item with value", () => {
    const result = TyXListItemNode.parse({
      type: "listitem",
      value: 1,
      children: [],
    })
    expect(result.value).toBe(1)
  })

  it("rejects list item missing value field", () => {
    expect(
      TyXListItemNode.safeParse({ type: "listitem", children: [] }).success,
    ).toBe(false)
  })
})

describe("TyXTabNode", () => {
  it("parses tab node", () => {
    const result = TyXTabNode.parse({ type: "tab", text: "\t" })
    expect(result.text).toBe("\t")
  })
})

describe("TyXCodeHighlightNode", () => {
  it("parses code-highlight node", () => {
    const result = TyXCodeHighlightNode.parse({
      type: "code-highlight",
      text: "let x = 1",
    })
    expect(result.text).toBe("let x = 1")
  })
})

describe("TyXTypstCodeNode", () => {
  it("parses typstcode node with nested editor state", () => {
    const result = TyXTypstCodeNode.parse({
      type: "typstcode",
      text: {
        editorState: {
          root: { type: "root", children: [] },
        },
      },
    })
    expect(result.type).toBe("typstcode")
  })
})

describe("TyXNode union", () => {
  it("parses text node via union", () => {
    const result = TyXNode.parse({ type: "text", text: "hi", format: 0 })
    expect(result.type).toBe("text")
  })

  it("rejects unknown node type", () => {
    expect(TyXNode.safeParse({ type: "unknown" }).success).toBe(false)
  })
})
