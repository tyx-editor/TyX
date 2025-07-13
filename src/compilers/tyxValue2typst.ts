import { TyXValue } from "../models"

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

  // @ts-ignore
  throw Error(`Unknown TyX Value type: ${value.type}`)
}

export default tyxValue2typst
