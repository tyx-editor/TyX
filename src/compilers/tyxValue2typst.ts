import { TyXValue } from "../models"
import lexical2typst from "./lexical2typst"

const tyxValue2typst = (value: TyXValue): string | undefined => {
  if (value.type === "length") {
    return (value.value ?? "") + value.unit
  }

  if (value.type === "boolean") {
    return value.value === undefined
      ? undefined
      : value.value
        ? "true"
        : "false"
  }

  if (value.type === "content") {
    if (!value.value) {
      return
    }
    const converted = lexical2typst(value.value)
    // Don't return empty string returned by lexical2typst
    if (!converted) {
      return
    }

    // Enter markup mode
    return "[" + converted + "]"
  }

  // @ts-ignore
  throw Error(`Unknown TyX Value type: ${value.type}`)
}

export default tyxValue2typst
