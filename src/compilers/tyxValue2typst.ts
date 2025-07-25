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
    // Remove leading "#" used for entering code mode.
    return value.value ? lexical2typst(value.value).substring(1) : undefined
  }

  // @ts-ignore
  throw Error(`Unknown TyX Value type: ${value.type}`)
}

export default tyxValue2typst
