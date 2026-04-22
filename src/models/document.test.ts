import {
  TyXCompilationOptions,
  TyXDocument,
  TyXDocumentSettings,
} from "./document"

describe("TyXCompilationOptions", () => {
  it("parses with root and fontPaths", () => {
    const result = TyXCompilationOptions.parse({
      root: "/home/user",
      fontPaths: ["/usr/fonts"],
    })
    expect(result.root).toBe("/home/user")
    expect(result.fontPaths).toEqual(["/usr/fonts"])
  })

  it("parses empty options (all optional)", () => {
    const result = TyXCompilationOptions.parse({})
    expect(result.root).toBeUndefined()
  })
})

describe("TyXDocumentSettings", () => {
  it("parses settings with paper and language", () => {
    const result = TyXDocumentSettings.parse({ paper: "a4", language: "en" })
    expect(result.paper).toBe("a4")
    expect(result.language).toBe("en")
  })

  it("parses empty settings", () => {
    const result = TyXDocumentSettings.parse({})
    expect(result.paper).toBeUndefined()
    expect(result.justified).toBeUndefined()
  })

  it("parses settings with indentation", () => {
    const result = TyXDocumentSettings.parse({
      indentation: { unit: "em", value: "1" },
    })
    expect(result.indentation?.unit).toBe("em")
  })

  it("parses settings with columns", () => {
    const result = TyXDocumentSettings.parse({ columns: 2 })
    expect(result.columns).toBe(2)
  })
})

describe("TyXDocument", () => {
  it("parses a valid document", () => {
    const result = TyXDocument.parse({
      version: "0.2.18",
      content: {
        root: { type: "root", children: [] },
      },
    })
    expect(result.version).toBe("0.2.18")
  })

  it("rejects document missing required version field", () => {
    expect(
      TyXDocument.safeParse({
        content: { root: { type: "root", children: [] } },
      }).success,
    ).toBe(false)
  })

  it("parses document with all optional fields", () => {
    const result = TyXDocument.parse({
      version: "0.2.18",
      preamble: "#set text(size: 11pt)",
      settings: { paper: "letter" },
    })
    expect(result.preamble).toBe("#set text(size: 11pt)")
    expect(result.settings?.paper).toBe("letter")
  })
})
