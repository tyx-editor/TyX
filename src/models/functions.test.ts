import { FunctionDefinition, ParameterDescription } from "./functions"

describe("ParameterDescription", () => {
  it("parses required parameter", () => {
    const result = ParameterDescription.parse({ type: "length", required: true })
    expect(result.type).toBe("length")
    expect(result.required).toBe(true)
  })

  it("parses optional parameter without label", () => {
    const result = ParameterDescription.parse({ type: "boolean" })
    expect(result.required).toBeUndefined()
    expect(result.label).toBeUndefined()
  })

  it("rejects missing type field", () => {
    expect(ParameterDescription.safeParse({ required: true }).success).toBe(false)
  })
})

describe("FunctionDefinition", () => {
  it("parses inline function with positional and named params", () => {
    const result = FunctionDefinition.parse({
      inline: true,
      positional: [{ type: "length", required: true }],
      named: [{ name: "weak", type: "boolean" }],
    })
    expect(result.inline).toBe(true)
    expect(result.positional).toHaveLength(1)
    expect(result.named).toHaveLength(1)
    expect(result.named![0].name).toBe("weak")
  })

  it("parses empty function definition", () => {
    const result = FunctionDefinition.parse({})
    expect(result.inline).toBeUndefined()
    expect(result.positional).toBeUndefined()
  })
})
