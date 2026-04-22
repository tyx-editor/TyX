import { TyXBooleanValue, TyXLength, TyXLengthValue, TyXValue } from "./values"

describe("TyXLength", () => {
  it("parses length with unit and value", () => {
    const result = TyXLength.parse({ unit: "em", value: "1" })
    expect(result.unit).toBe("em")
    expect(result.value).toBe("1")
  })

  it("parses empty length (all optional)", () => {
    const result = TyXLength.parse({})
    expect(result.unit).toBeUndefined()
    expect(result.value).toBeUndefined()
  })
})

describe("TyXBooleanValue", () => {
  it("parses true boolean value", () => {
    const result = TyXBooleanValue.parse({ type: "boolean", value: true })
    expect(result.value).toBe(true)
  })

  it("parses false boolean value", () => {
    const result = TyXBooleanValue.parse({ type: "boolean", value: false })
    expect(result.value).toBe(false)
  })

  it("parses unset boolean value (undefined)", () => {
    const result = TyXBooleanValue.parse({ type: "boolean" })
    expect(result.value).toBeUndefined()
  })

  it("rejects wrong type discriminator", () => {
    expect(TyXBooleanValue.safeParse({ type: "length" }).success).toBe(false)
  })
})

describe("TyXLengthValue", () => {
  it("parses length value with type discriminator", () => {
    const result = TyXLengthValue.parse({
      type: "length",
      unit: "pt",
      value: "12",
    })
    expect(result.type).toBe("length")
    expect(result.unit).toBe("pt")
  })

  it("rejects wrong type discriminator", () => {
    expect(
      TyXLengthValue.safeParse({ type: "boolean", unit: "pt" }).success,
    ).toBe(false)
  })
})

describe("TyXValue", () => {
  it("parses as length value", () => {
    const result = TyXValue.parse({ type: "length", unit: "em", value: "2" })
    expect(result.type).toBe("length")
  })

  it("parses as boolean value", () => {
    const result = TyXValue.parse({ type: "boolean", value: true })
    expect(result.type).toBe("boolean")
  })

  it("parses as content value", () => {
    const result = TyXValue.parse({
      type: "content",
      value: { type: "text", text: "hi", format: 0 },
    })
    expect(result.type).toBe("content")
  })

  it("rejects unknown type", () => {
    expect(TyXValue.safeParse({ type: "number", value: 42 }).success).toBe(
      false,
    )
  })
})
