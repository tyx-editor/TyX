import {
  parseCommandParameter,
  parseCommandSequence,
  splitCommand,
} from "./commands"

describe("parseCommandParameter", () => {
  it("returns null for 'null'", () => {
    expect(parseCommandParameter("null")).toBeNull()
  })

  it("returns true for 'true'", () => {
    expect(parseCommandParameter("true")).toBe(true)
  })

  it("returns false for 'false'", () => {
    expect(parseCommandParameter("false")).toBe(false)
  })

  it("returns number for numeric string", () => {
    expect(parseCommandParameter("42")).toBe(42)
    expect(parseCommandParameter("3.14")).toBe(3.14)
    expect(parseCommandParameter("0")).toBe(0)
  })

  it("returns parsed object for JSON string", () => {
    expect(parseCommandParameter('{"key":"value"}')).toEqual({ key: "value" })
  })

  it("returns parsed array for JSON array string", () => {
    expect(parseCommandParameter("[1,2,3]")).toEqual([1, 2, 3])
  })

  it("returns string as-is for non-JSON non-numeric", () => {
    expect(parseCommandParameter("formatText")).toBe("formatText")
    expect(parseCommandParameter("bold")).toBe("bold")
  })
})

describe("splitCommand", () => {
  it("splits simple command by spaces", () => {
    expect(splitCommand("formatText bold")).toEqual(["formatText", "bold"])
  })

  it("does not split inside braces", () => {
    expect(splitCommand('setFunctionCall {"name":"h"}')).toEqual([
      "setFunctionCall",
      '{"name":"h"}',
    ])
  })

  it("does not split inside quotes", () => {
    expect(splitCommand('insertHeading "h1"')).toEqual([
      "insertHeading",
      '"h1"',
    ])
  })

  it("does not split inside brackets", () => {
    expect(splitCommand("setList [1,2,3]")).toEqual(["setList", "[1,2,3]"])
  })

  it("handles command with no arguments", () => {
    expect(splitCommand("undo")).toEqual(["undo"])
  })

  it("handles nested braces", () => {
    expect(splitCommand('cmd {"a":{"b":1}}')).toEqual([
      "cmd",
      '{"a":{"b":1}}',
    ])
  })

  it("handles multiple arguments", () => {
    expect(splitCommand("cmd arg1 arg2 arg3")).toEqual([
      "cmd",
      "arg1",
      "arg2",
      "arg3",
    ])
  })

  it("handles empty string", () => {
    expect(splitCommand("")).toEqual([""])
  })
})

describe("parseCommandSequence", () => {
  it("parses single command", () => {
    expect(parseCommandSequence("undo")).toEqual([["undo"]])
  })

  it("parses command with argument", () => {
    expect(parseCommandSequence("formatText bold")).toEqual([
      ["formatText", "bold"],
    ])
  })

  it("parses command with boolean argument", () => {
    expect(parseCommandSequence("insertMath true")).toEqual([
      ["insertMath", true],
    ])
  })

  it("splits sequence by semicolons", () => {
    expect(parseCommandSequence("undo;redo")).toEqual([["undo"], ["redo"]])
  })

  it("trims whitespace around semicolons", () => {
    expect(parseCommandSequence("undo ; redo")).toEqual([["undo"], ["redo"]])
  })

  it("parses JSON argument in sequence", () => {
    const result = parseCommandSequence('setFunctionCall {"name":"h"}')
    expect(result).toEqual([["setFunctionCall", { name: "h" }]])
  })
})
